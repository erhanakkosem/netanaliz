#!/usr/bin/env python3
"""One-shot scrape: run this to populate the database immediately."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

from database import Database
from odds_api import OddsAPIClient

def main():
    logger.info("=== One-Shot Scrape ===")
    db = Database()
    api_key = os.getenv('THE_ODDS_API_KEY', '')
    client = OddsAPIClient(api_key=api_key)
    
    for sport in ['soccer', 'basketball']:
        logger.info(f"Fetching {sport}...")
        data = client.fetch_theoddsapi(sport=sport)
        if data:
            saved = client.parse_and_save(data, db)
            logger.info(f"Saved {saved} odds records for {sport}")
    
    total = db.conn.execute('SELECT COUNT(*) as c FROM Match').fetchone()['c']
    odds_count = db.conn.execute('SELECT COUNT(*) as c FROM MatchOdds').fetchone()['c']
    logger.info(f"Database: {total} matches, {odds_count} odds records")
    db.close()
    logger.info("Done!")

if __name__ == '__main__':
    main()
