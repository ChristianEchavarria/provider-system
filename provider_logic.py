import csv
import random
from datetime import datetime, timedelta

# Regulated Lists (Normalized for easier matching)
# Using a set of strings for faster lookup. Strings should be lowercased and stripped.

REGULATED_DORADOBET_PERU = {
    "amusnet livecasino", "evolution", "evolution slot(evolution)", "ezugi", "playtech livecasino",
    "pragmatic livecasino", "golden race", "pragmaticbingo", "7777gaming", "amusnet", "aviatrix",
    "booming", "btg", "ct interactive", "endorphina", "fazi", "isofbet", "isoftbet", "netend", "nolimit city",
    "platipus", "playngo", "playtech", "pragmatic", "redrake", "redtiger", "rubyplay", "smartsoft",
    "spribe", "pascal", "worldmatch", "playson", "bragg", "galaxsys", "pariplay", "spinberry",
    "bgaming", "ainsworth", "leap gaming", "hacksaw", "caleta", "spinomena", "eurasian gaming",
    "amigogaming", "egt", "universalsoft"
}

REGULATED_GANGABET_PERU = {
    "golden race", "ct interactive", "fazi", "playngo", "pragmatic", "redrake", "rubyplay",
    "spribe", "pragmatic livecasino", "amusnet livecasino", "amusnet", "playson", "evolution",
    "evolution slot(evolution)", "btg", "netend", "nolimit city", "redtiger", "ezugi"
}

def normalize(text):
    if not text:
        return ""
    # Remove spaces and lower case for robust matching (e.g. "Golden Race" == "Goldenrace")
    return text.strip().lower().replace(" ", "")

def load_data(filepath):
    providers = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter='\t')
            headers = next(reader)
            headers = [h.strip() for h in headers]
            
            for row in reader:
                if not row or not any(row): continue
                if len(row) < len(headers):
                    row += [''] * (len(headers) - len(row))
                
                provider_data = {}
                for i, header in enumerate(headers):
                    provider_data[header] = row[i].strip()
                providers.append(provider_data)
                
    except Exception as e:
        print(f"Error loading data: {e}")
        return [], []
        
    return headers, providers

def analyze_compliance(providers, headers):
    alerts = []
    col_dora_peru = None
    col_ganga_peru = None
    
    for h in headers:
        if "Doradobet Perú" in h:
            col_dora_peru = h
        if "Gangabet Perú" in h:
            col_ganga_peru = h
            
    if not col_dora_peru or not col_ganga_peru:
        print("Warning: Could not find 'Doradobet Perú' or 'Gangabet Perú' columns in data.")
        return alerts
    
    normalized_dora_list = {normalize(x) for x in REGULATED_DORADOBET_PERU}
    normalized_ganga_list = {normalize(x) for x in REGULATED_GANGABET_PERU}
    
    for p in providers:
        prov_name = p.get('Proveedor', '')
        sub_prov = p.get('Sub-proveedor', '')
        
        names_to_check = [prov_name, sub_prov]
        names_normalized = [normalize(n) for n in names_to_check if n]
        
        # Check Doradobet Peru
        status_dora = normalize(p.get(col_dora_peru, ''))
        if status_dora in ['si', 'active', 'yes']:
            is_found = False
            for n_data in names_normalized:
                if n_data in normalized_dora_list:
                    is_found = True
                    break
                # Substring check
                for reg in normalized_dora_list:
                    if reg in n_data or n_data in reg: 
                         is_found = True
                         break
            
            if not is_found:
                alerts.append({
                    "type": "Doradobet Perú Alert",
                    "provider": prov_name,
                    "sub_provider": sub_prov,
                    "message": "Active but NOT in Regulated List"
                })

        # Check Gangabet Peru
        status_ganga = normalize(p.get(col_ganga_peru, ''))
        if status_ganga in ['si', 'active', 'yes']:
            is_found = False
            for n_data in names_normalized:
                if n_data in normalized_ganga_list:
                    is_found = True
                    break
                for reg in normalized_ganga_list:
                    if reg in n_data or n_data in reg: 
                         is_found = True
                         break
            
            if not is_found:
                alerts.append({
                    "type": "Gangabet Perú Alert",
                    "provider": prov_name,
                    "sub_provider": sub_prov,
                    "message": "Active but NOT in Regulated List"
                })
                
    return alerts

def generate_dashboard_stats(providers, headers):
    stats = {}
    operation_cols = headers[3:]
    for op in operation_cols:
        active_count = 0
        for p in providers:
            status = normalize(p.get(op, ''))
            if status in ['si', 'active', 'yes']:
                active_count += 1
        stats[op] = active_count
    return stats

def simulate_activity_log(providers):
    # Simulate realistic activity changes for the "last hour"
    log = []
    current_time = datetime.now()
    
    # Pick random providers to have "changed"
    sample_providers = random.sample(providers, k=min(5, len(providers)))
    
    for p in sample_providers:
        prov_name = p.get("Proveedor", "Unknown")
        # Randomly assign a change
        change_type = random.choice(["Active -> Inactive", "Inactive -> Active"])
        timestamp = current_time - timedelta(minutes=random.randint(1, 59))
        
        log.append({
            "time": timestamp.strftime("%H:%M:%S"),
            "provider": prov_name,
            "change": change_type
        })
        
    return sorted(log, key=lambda x: x['time'], reverse=True)

if __name__ == "__main__":
    headers, providers = load_data("data.txt")
    if not providers:
        print("No data found.")
    else:
        # Dashboard Header
        print("========================================")
        print("   PROVIDER INTELLIGENCE CENTER (v1.0)  ")
        print("========================================")
        
        print(f"\n[GLOBAL METRICS]")
        print(f"Total Providers: {len(providers)}")
        print(f"Total Operations: {len(headers) - 3}")
        
        # 1. Stats
        print("\n[ACTIVE PROVIDERS PER OPERATION]")
        stats = generate_dashboard_stats(providers, headers)
        for op, count in stats.items():
            print(f"  - {op.ljust(25)}: {count}")
            
        # 2. Activity Log (Simulated)
        print("\n[LAST HOUR ACTIVITY LOG]")
        activity_log = simulate_activity_log(providers)
        for entry in activity_log:
            print(f"  {entry['time']} | {entry['provider']} | {entry['change']}")

        # 3. Alerts
        print("\n[COMPLIANCE ALERTS - CRITICAL]")
        alerts = analyze_compliance(providers, headers)
        if alerts:
            for a in alerts:
                print(f"  [!] {a['type']}: {a['provider'].upper()} ({a['sub_provider']}) -> {a['message']}")
        else:
            print("  [OK] No compliance alerts found. System Healthy.")
