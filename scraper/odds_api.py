import requests
import logging
import json
import os
from datetime import datetime, timedelta
from typing import Optional
from database import Database

logger = logging.getLogger(__name__)

class CreditTracker:
    """Track TheOddsAPI credit usage (500 credits/month free tier)."""
    
    def __init__(self, tracker_file: str = None):
        if tracker_file is None:
            tracker_file = os.path.join(os.path.dirname(__file__), '..', '.credit_tracker.json')
        self.tracker_file = tracker_file
        self.data = self._load()
    
    def _load(self) -> dict:
        try:
            if os.path.exists(self.tracker_file):
                with open(self.tracker_file, 'r') as f:
                    return json.load(f)
        except Exception:
            pass
        return {'total_used': 0, 'monthly_used': 0, 'month': '', 'requests': []}
    
    def _save(self):
        os.makedirs(os.path.dirname(self.tracker_file), exist_ok=True)
        with open(self.tracker_file, 'w') as f:
            json.dump(self.data, f, indent=2)
    
    def _reset_monthly_if_needed(self):
        current_month = datetime.now().strftime('%Y-%m')
        if self.data.get('month') != current_month:
            self.data['monthly_used'] = 0
            self.data['month'] = current_month
            self.data['requests'] = []
    
    def can_make_request(self, estimated_credits: int = 1) -> bool:
        self._reset_monthly_if_needed()
        return (self.data['monthly_used'] + estimated_credits) <= 500
    
    def record_usage(self, credits: int = 1, endpoint: str = ''):
        self._reset_monthly_if_needed()
        self.data['total_used'] += credits
        self.data['monthly_used'] += credits
        self.data['requests'].append({
            'timestamp': datetime.now().isoformat(),
            'credits': credits,
            'endpoint': endpoint,
            'monthly_total': self.data['monthly_used']
        })
        if len(self.data['requests']) > 100:
            self.data['requests'] = self.data['requests'][-50:]
        self._save()
        logger.info(f"Credits used: {credits} (Monthly: {self.data['monthly_used']}/500)")
    
    def get_usage(self) -> dict:
        self._reset_monthly_if_needed()
        return {
            'total_used': self.data['total_used'],
            'monthly_used': self.data['monthly_used'],
            'remaining': 500 - self.data['monthly_used'],
            'month': self.data.get('month', '')
        }

class OddsAPIClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or ''
        self.credit_tracker = CreditTracker()
    
    def fetch_remaining_credits(self) -> Optional[int]:
        """Check remaining credits from API headers."""
        if not self.api_key:
            return None
        url = f'https://api.the-odds-api.com/v4/sports?apiKey={self.api_key}'
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                remaining = response.headers.get('x-requests-remaining')
                if remaining:
                    return int(remaining)
        except Exception:
            pass
        return None
    
    def fetch_theoddsapi(self, sport: str = 'soccer') -> list[dict]:
        """Fetch from the-odds-api.com with credit tracking."""
        if not self.api_key:
            logger.warning("No API key configured. Set THE_ODDS_API_KEY in .env")
            return []
        
        if not self.credit_tracker.can_make_request(1):
            logger.warning(f"Monthly credit limit reached ({self.credit_tracker.get_usage()['monthly_used']}/500). Skipping.")
            return []
        
        url = f'https://api.the-odds-api.com/v4/sports/{sport}/odds'
        params = {
            'apiKey': self.api_key,
            'regions': 'eu',
            'markets': 'h2h',
            'oddsFormat': 'decimal',
            'dateFormat': 'iso'
        }
        try:
            response = requests.get(url, params=params, timeout=15)
            if response.status_code == 200:
                self.credit_tracker.record_usage(1, f'/sports/{sport}/odds')
                remaining = response.headers.get('x-requests-remaining', '?')
                logger.info(f"TheOddsAPI: {len(response.json())} matches (credits remaining: {remaining})")
                return response.json()
            elif response.status_code == 401:
                logger.error("TheOddsAPI: Invalid API key")
            elif response.status_code == 429:
                logger.error("TheOddsAPI: Rate limited or quota exceeded")
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
