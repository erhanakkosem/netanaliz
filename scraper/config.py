import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

DATABASE_URL = os.getenv('DATABASE_URL', 'file:./dev.db')

# Optimize: 6 saat = 360 dakika (500 kredi/ay limiti için)
SCRAPE_INTERVAL_MINUTES = int(os.getenv('SCRAPE_INTERVAL_MINUTES', '360'))

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

# Free tier: sadece soccer (futbol) - 1 istek = 1 kredi
MAX_MONTHLY_CREDITS = 500

BOOKMAKERS = {
    'bet365': {'name': 'Bet365', 'code': 'OA-1', 'base_url': 'https://www.bet365.com'},
    'pinnacle': {'name': 'Pinnacle', 'code': 'OA-2', 'base_url': 'https://www.pinnacle.com'},
    'betfair': {'name': 'Betfair', 'code': 'OA-3', 'base_url': 'https://www.betfair.com'},
    'bwin': {'name': 'Bwin', 'code': 'OA-4', 'base_url': 'https://www.bwin.com'},
    'unibet': {'name': 'Unibet', 'code': 'OA-5', 'base_url': 'https://www.unibet.com'},
    '1xbet': {'name': '1xBet', 'code': 'OA-6', 'base_url': 'https://www.1xbet.com'},
    'iddaa': {'name': 'İddaa', 'code': 'OA-7', 'base_url': 'https://www.iddaa.com'},
}

LEAGUES = [
    'Super Lig', '1.Lig', 'Premier League', 'La Liga',
    'Serie A', 'Bundesliga', 'Ligue 1', 'Champions League'
]
