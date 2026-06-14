#!/usr/bin/env python3
import os
import time
import schedule
import logging
from config import SCRAPE_INTERVAL_MINUTES
from database import Database
from odds_api import OddsAPIClient

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def scrape_all_sources():
    logger.info("=== Scrape Cycle ===")
    db = Database()
    api_key = os.getenv('THE_ODDS_API_KEY', '')
    client = OddsAPIClient(api_key=api_key)
    
    sports = os.getenv('SCRAPE_SPORTS', 'soccer,basketball').split(',')
    total_saved = 0
    
    for sport in sports:
        sport = sport.strip()
        if not sport:
            continue
        try:
            data = client.fetch_theoddsapi(sport=sport)
            if data:
                saved = client.parse_and_save(data, db)
                total_saved += saved
                logger.info(f"{sport}: {saved} odds saved")
            else:
                logger.info(f"{sport}: no data (API key configured: {bool(api_key)})")
        except Exception as e:
            logger.error(f"Error scraping {sport}: {e}")
    
    match_count = db.conn.execute('SELECT COUNT(*) as c FROM Match').fetchone()['c']
    odds_count = db.conn.execute('SELECT COUNT(*) as c FROM MatchOdds').fetchone()['c']
    logger.info(f"Total: {match_count} matches, {odds_count} odds | Saved: {total_saved}")
    db.close()

def run_scheduler():
    logger.info(f"Starting scheduler (interval: {SCRAPE_INTERVAL_MINUTES} min)")
    scrape_all_sources()
    schedule.every(SCRAPE_INTERVAL_MINUTES).minutes.do(scrape_all_sources)
    while True:
        schedule.run_pending()
        time.sleep(30)

if __name__ == '__main__':
    try:
        run_scheduler()
    except KeyboardInterrupt:
        logger.info("Stopped by user")
    except Exception as e:
        logger.error(f"Fatal: {e}")
        exit(1)
