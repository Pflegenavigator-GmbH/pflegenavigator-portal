import { NextRequest, NextResponse } from 'next/server';

interface NewsletterSignup {
  email: string;
  language: string;
  topics: string[];
  privacyAccepted: boolean;
  confirmationToken?: string;
  confirmed?: boolean;
}

// In-memory Store fuer Demo (in Produktion: Datenbank)
const subscribers: NewsletterSignup[] = [];

export async function POST(request: NextRequest) {
  try {
    const data: NewsletterSignup = await request.json();
    
    // Validierung
    if (!data.email || !isValidEmail(data.email)) {
      return NextResponse.json(
        { error: 'Ungueltige E-Mail-Adresse' },
        { status: 400 }
      );
    }
    
    if (!data.privacyAccepted) {
      return NextResponse.json(
        { error: 'Datenschutz muss akzeptiert werden' },
        { status: 400 }
      );
    }
    
    // Pruefe auf Duplikate
    if (subscribers.some(s => s.email.toLowerCase() === data.email.toLowerCase())) {
      return NextResponse.json(
        { error: 'Diese E-Mail ist bereits angemeldet' },
        { status: 409 }
      );
    }
    
    // Speichere Subscriber
    const subscriber = {
      email: data.email.toLowerCase(),
      language: data.language || 'de',
      topics: data.topics || [],
      privacyAccepted: data.privacyAccepted,
      subscribedAt: new Date().toISOString(),
      confirmed: false,
      confirmationToken: generateToken()
    };
    
    subscribers.push(subscriber);
    
    // In Produktion: Sende Bestaetigungs-E-Mail
    // await sendConfirmationEmail(subscriber);
    
    console.log('Newsletter signup:', {
      email: subscriber.email,
      language: subscriber.language,
      topics: subscriber.topics
    });
    
    return NextResponse.json({
      success: true,
      message: 'Bitte bestaetigen Sie Ihre E-Mail-Adresse',
      requiresConfirmation: true
    });
    
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Anmeldung' },
      { status: 500 }
    );
  }
}

// GET: Bestaetigung
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (!token) {
    return NextResponse.json(
      { error: 'Token fehlt' },
      { status: 400 }
    );
  }
  
  const subscriber = subscribers.find(s => s.confirmationToken === token);
  
  if (!subscriber) {
    return NextResponse.json(
      { error: 'Ungueltiger Token' },
      { status: 404 }
    );
  }
  
  subscriber.confirmed = true;
  
  return NextResponse.json({
    success: true,
    message: 'E-Mail erfolgreich bestaetigt'
  });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
