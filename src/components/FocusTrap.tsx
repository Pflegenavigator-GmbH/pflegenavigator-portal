'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  onEscape?: () => void;
  initialFocusRef?: React.RefObject<HTMLElement>;
  returnFocusRef?: React.RefObject<HTMLElement>;
  className?: string;
}

/**
 * FocusTrap - WCAG 2.1 AA konforme Fokus-Falle für Modale
 * 
 * Hält den Fokus innerhalb eines Modal/Dialogs und ermöglicht
 * Navigation mit Tab-Taste innerhalb des Traps.
 * 
 * Features:
 * - Tab schließt den Kreis (erster/letzter Tab-Stop)
 * - Escape schließt das Modal
 * - Initialer Fokus auf erstes fokussierbares Element oder angegebene Referenz
 * - Fokus-Rückkehr beim Schließen
 * 
 * @example
 * <FocusTrap isActive={isOpen} onEscape={handleClose}>
 *   <ModalDialog>...</ModalDialog>
 * </FocusTrap>
 */
export function FocusTrap({
  children,
  isActive,
  onEscape,
  initialFocusRef,
  returnFocusRef,
  className,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Speichere den aktiven Fokus beim Öffnen
  useEffect(() => {
    if (isActive) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [isActive]);

  // Fokus zurückgeben beim Schließen
  useEffect(() => {
    return () => {
      if (returnFocusRef?.current) {
        returnFocusRef.current.focus();
      } else if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [returnFocusRef]);

  // Initialer Fokus
  useEffect(() => {
    if (isActive && containerRef.current) {
      // Warte auf DOM-Update
      setTimeout(() => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else {
          // Suche erstes fokussierbares Element
          if (containerRef.current) {
            const focusableElements = getFocusableElements(containerRef.current);
            if (focusableElements.length > 0) {
              focusableElements[0].focus();
            }
          }
        }
      }, 0);
    }
  }, [isActive, initialFocusRef]);

  // Escape-Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive && onEscape) {
        e.preventDefault();
        onEscape();
      }
    };

    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onEscape]);

  // Tab-Trap Handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Shift+Tab auf erstem Element -> zum letzten Element
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
    // Tab auf letztem Element -> zum ersten Element
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }, []);

  // Hilfsfunktion: Alle fokussierbaren Elemente finden
  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const selector = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    const elements = Array.from(container.querySelectorAll(selector)) as HTMLElement[];
    
    // Filtere nicht-sichtbare Elemente
    return elements.filter((el) => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  };

  if (!isActive) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      className={cn(className)}
    >
      {children}
    </div>
  );
}

export default FocusTrap;
