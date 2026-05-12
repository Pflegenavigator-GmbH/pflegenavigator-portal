#!/usr/bin/env python3
"""
Health-Check Agent für PflegeNavigator EU
Prüft alle Systeme und Agenten, sendet Report
"""

import json
import sys
from pathlib import Path
from datetime import datetime

class HealthCheck:
    def __init__(self):
        self.checks = []
        self.status = "GREEN"
        self.errors = []
    
    def check_file_exists(self, path: str, required: bool = True) -> bool:
        """Prüft ob Datei existiert"""
        file_path = Path(path)
        exists = file_path.exists()
        
        self.checks.append({
            "name": f"File: {path}",
            "status": "OK" if exists else ("ERROR" if required else "WARNING"),
            "required": required
        })
        
        if required and not exists:
            self.status = "RED"
            self.errors.append(f"Fehlende Datei: {path}")
        
        return exists
    
    def check_schema_valid(self, schema_file: str) -> bool:
        """Prüft ob JSON-Schema valide ist"""
        try:
            with open(schema_file) as f:
                json.load(f)
            
            self.checks.append({
                "name": f"Schema: {schema_file}",
                "status": "OK"
            })
            return True
            
        except Exception as e:
            self.checks.append({
                "name": f"Schema: {schema_file}",
                "status": "ERROR",
                "error": str(e)
            })
            self.status = "RED"
            self.errors.append(f"Ungültiges Schema: {schema_file}")
            return False
    
    def check_agents(self) -> dict:
        """Prüft Sub-Agenten-Status"""
        agents = {
            "Reise-Klaus": {"status": "WAITING", "bot": "@ReiseKlaus_Bot"},
            "Krisenagent": {"status": "WAITING", "bot": "@Krisenagent_Bot"},
            "EU-Führerschein": {"status": "WAITING", "bot": "@EUFuehrerschein_Bot"},
            "Business-Advisor": {"status": "WAITING", "bot": "@PflegeNavigatorBusiness_Bot"}
        }
        
        # TODO: Aktive Verbindung prüfen wenn Tokens vorhanden
        
        for name, info in agents.items():
            self.checks.append({
                "name": f"Agent: {name}",
                "status": info["status"],
                "bot": info["bot"]
            })
        
        return agents
    
    def run(self) -> dict:
        """Führt alle Checks durch"""
        print("🔍 Starte Health-Check...")
        
        # Kritische Dateien
        self.check_file_exists("SYSTEM.md", required=True)
        self.check_file_exists("CHANGELOG.md", required=True)
        self.check_file_exists("SOUL.md", required=True)
        self.check_file_exists("TOOLS.md", required=True)
        self.check_file_exists("HEARTBEAT.md", required=False)
        self.check_file_exists("NAVI_MASTER_ANWEISUNG.md", required=False)
        
        # Schemas
        schemas = [
            "templates/sgb-i-grundsicherung.json",
            "templates/sgb-v-krankenversicherung.json",
            "templates/sgb-xi-pflegegrad.json",
            "templates/sgb-xii-sozialhilfe.json",
            "templates/sgb-xiv-teilhabe.json",
            "templates/nba-6-module.json"
        ]
        
        for schema in schemas:
            self.check_schema_valid(schema)
        
        # Agenten
        agents = self.check_agents()
        
        # Report generieren
        report = {
            "timestamp": datetime.now().isoformat(),
            "status": self.status,
            "summary": {
                "total_checks": len(self.checks),
                "ok": len([c for c in self.checks if c["status"] == "OK"]),
                "warnings": len([c for c in self.checks if c["status"] == "WARNING"]),
                "errors": len([c for c in self.checks if c["status"] == "ERROR"])
            },
            "checks": self.checks,
            "agents": agents,
            "errors": self.errors
        }
        
        return report
    
    def save_and_report(self, report: dict):
        """Speichert Report und zeigt Zusammenfassung"""
        # Speichern
        report_path = Path("HEARTBEAT.md")
        
        # Template aktualisieren
        template = f"""# HEARTBEAT.md – PflegeNavigator EU

**Automatischer System-Status | Täglich 20:00 Uhr**

---

## Aktueller Status ({datetime.now().strftime('%Y-%m-%d %H:%M')})

### System-Health
- **Status:** {report['status']}
- **Checks:** {report['summary']['ok']} OK / {report['summary']['warnings']} Warnungen / {report['summary']['errors']} Fehler

### Agenten-Status
| Agent | Status | Bot |
|-------|--------|-----|
| Reise-Klaus | {report['agents']['Reise-Klaus']['status']} | {report['agents']['Reise-Klaus']['bot']} |
| Krisenagent | {report['agents']['Krisenagent']['status']} | {report['agents']['Krisenagent']['bot']} |
| EU-Führerschein | {report['agents']['EU-Führerschein']['status']} | {report['agents']['EU-Führerschein']['bot']} |
| Business-Advisor | {report['agents']['Business-Advisor']['status']} | {report['agents']['Business-Advisor']['bot']} |

### Offene Blocker
{chr(10).join(['- [ ] ' + e for e in report['errors']]) if report['errors'] else '- Keine'}

### Heute erledigt
- [ ] Health-Check durchgeführt

### Morgen geplant
- [ ] Bot-Verbindungen prüfen

---

## Manual-Trigger

Falls vor 20:00 Uhr ein Check nötig ist:
```
[OpenClaw heartbeat poll]
```

---

# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Add tasks below when you want the agent to check something periodically.
"""
        
        with open(report_path, 'w') as f:
            f.write(template)
        
        # Konsole
        print(f"\n{'='*60}")
        print(f"🚦 STATUS: {report['status']}")
        print(f"{'='*60}")
        print(f"✅ OK: {report['summary']['ok']}")
        print(f"⚠️  Warnungen: {report['summary']['warnings']}")
        print(f"❌ Fehler: {report['summary']['errors']}")
        
        if report['errors']:
            print(f"\n❌ Fehler:")
            for e in report['errors']:
                print(f"   - {e}")
        
        print(f"\n📝 Report gespeichert: {report_path}")

if __name__ == "__main__":
    checker = HealthCheck()
    report = checker.run()
    checker.save_and_report(report)
