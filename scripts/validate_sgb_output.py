#!/usr/bin/env python3
"""
SGB-Modul Validator für PflegeNavigator EU
Prüft JSON-Outputs gegen definierte Schemas
"""

import json
import sys
from pathlib import Path
from jsonschema import validate, ValidationError

SCHEMAS = {
    "sgb-xi": "templates/sgb-xi-pflegegrad.json",
    "sgb-xiv": "templates/sgb-xiv-teilhabe.json",
}

def load_schema(module: str) -> dict:
    """Lädt JSON-Schema für ein SGB-Modul"""
    schema_path = Path(__file__).parent / SCHEMAS[module]
    with open(schema_path) as f:
        return json.load(f)

def validate_output(module: str, output: dict) -> tuple[bool, str]:
    """
    Validiert einen Output gegen das Schema.
    Returns: (is_valid, error_message)
    """
    try:
        schema = load_schema(module)
        validate(instance=output, schema=schema)
        return True, "✅ Validierung erfolgreich"
    except ValidationError as e:
        return False, f"❌ Validierungsfehler: {e.message} (Pfad: {list(e.path)})"
    except Exception as e:
        return False, f"❌ Fehler: {str(e)}"

def test_sample(module: str, sample_file: str):
    """Testet ein Beispiel-JSON gegen das Schema"""
    print(f"\n🧪 Teste {module.upper()} mit {sample_file}")
    
    try:
        with open(sample_file) as f:
            output = json.load(f)
        
        is_valid, message = validate_output(module, output)
        print(message)
        return is_valid
        
    except FileNotFoundError:
        print(f"⚠️  Sample-Datei nicht gefunden: {sample_file}")
        return None
    except json.JSONDecodeError as e:
        print(f"❌ Ungültiges JSON: {e}")
        return False

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="SGB-Modul Validator")
    parser.add_argument("module", choices=["sgb-xi", "sgb-xiv"], help="Zu validierendes Modul")
    parser.add_argument("--sample", "-s", help="Pfad zur Sample-JSON-Datei")
    parser.add_argument("--strict", action="store_true", help="Strikter Modus - zusätzliche Prüfungen")
    
    args = parser.parse_args()
    
    if args.sample:
        result = test_sample(args.module, args.sample)
        sys.exit(0 if result else 1)
    else:
        # Schema-Info anzeigen
        schema = load_schema(args.module)
        print(f"\n📋 Schema: {schema.get('title', 'Unbekannt')}")
        print(f"📝 Beschreibung: {schema.get('description', 'Keine')}")
        print(f"🔑 Required Felder: {', '.join(schema.get('required', []))}")
        print("\n✅ Schema geladen. Nutze --sample <datei.json> zum Testen.")
