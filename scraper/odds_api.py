import requests
import logging
from datetime import datetime
from typing import Optional
from database import Database

logger = logging.getLogger(__name__)

class OddsAPIClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or ''

    def fetch_theoddsapi(self, sport: str = 'soccer') -> list[dict]:
        """Fetch from the-odds-api.com"""
        if not self.api_key:
            logger.warning("No API key configured. Set THE_ODDS_API_KEY in .env")
            return []
        
        url = f'https://api.the-odds-api.com/v4/sports/{sport}/odds'
        params = {
            'apiKey': self.api_key,
            'regions': 'eu,turkey',
            'markets': 'h2h,over_under',
            'oddsFormat': 'decimal'
        }
        try:
            response = requests.get(url, params=params, timeout=15)
            if response.status_code == 200:
                logger.info(f"TheOddsAPI: {len(response.json())} matches fetched")
                return response.json()
            elif response.status_code == 401:
                logger.error("TheOddsAPI: Invalid API key")
            else:
                logger.warning(f"TheOddsAPI: HTTP {response.status_code}")
            return []
        except requests.exceptions.Timeout:
            logger.error("TheOddsAPI: Request timed out")
            return []
        except Exception as e:
            logger.error(f"TheOddsAPI error: {e}")
            return []
    
    def parse_and_save(self, data: list[dict], db: Database) -> int:
        """Parse TheOddsAPI response and save to database."""
        saved = 0
        bookmakers_cache = {bm['name']: bm for bm in db.get_bookmakers()}
        today = datetime.now().strftime('%Y-%m-%d')
        
        for event in data:
            try:
                home_team = event.get('home_team', 'Unknown')
                away_team = event.get('away_team', 'Unknown')
                league = event.get('sport_title', 'Unknown')
                commence_time = event.get('commence_time', '')
                
                match_date = datetime.fromisoformat(commence_time.replace('Z', '+00:00')) if commence_time else datetime.now()
                
                match_id = db.find_or_create_match(
                    home_team=home_team,
                    away_team=away_team,
                    league=league,
                    match_date=match_date
                )
                if not match_id:
                    continue
                
                for bm in event.get('bookmakers', []):
                    bm_name = bm.get('title', '')
                    bm_config = None
                    for name, config in bookmakers_cache.items():
                        if bm_name.lower() in name.lower() or name.lower() in bm_name.lower():
                            bm_config = config
                            break
                    
                    if not bm_config:
                        continue
                    
                    bookmaker_id = bm_config['id']
                    
                    for market in bm.get('markets', []):
                        if market['key'] == 'h2h':
                            outcomes = market.get('outcomes', [])
                            odds_map = {'home': 'MS1', 'draw': 'MSX', 'away': 'MS2'}
                            for outcome in outcomes:
                                odds_type = odds_map.get(outcome.get('name', '').lower(), '')
                                if odds_type:
                                    odds_value = float(outcome.get('price', 0))
                                    db.upsert_odds(match_id, bookmaker_id, odds_type, odds_value, odds_value)
                                    saved += 1
                                    
            except Exception as e:
                logger.error(f"Error parsing event: {e}")
                continue
        
        return saved
