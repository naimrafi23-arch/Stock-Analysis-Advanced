import requests
import json
import pandas as pd
from bs4 import BeautifulSoup

def get_dse_data():
    url = "https://www.dsebd.org/latest_share_price_scroll_l.php"
    # Scrape real prices here using BeautifulSoup
    # For now, we create a placeholder structure for your ML logic
    data = {
        "last_updated": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M"),
        "stocks": {
            "GP": {"rsi": 45.2, "signal": "BUY", "confidence": 82},
            "BRACBANK": {"rsi": 68.1, "signal": "HOLD", "confidence": 55}
        }
    }
    with open('data.json', 'w') as f:
        json.dump(data, f)

if __name__ == "__main__":
    get_dse_data()