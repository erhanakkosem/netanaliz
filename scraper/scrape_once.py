#!/usr/bin/env python3
"""One-shot scrape: run this to populate the database immediately."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

from odds_api import OddsAPIClient, CreditTracker

# Scraper uses local SQLite (PostgreSQL via Prisma for Next.js app)
import sqlite3
import uuid
from datetime import datetime

SCRAPER_DB = os.path.join(os.path.dirname(__file__), '..', 'dev.db')

def get_db():
    conn = sqlite3.connect(SCRAPER_DB)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS Bookmaker (
            id TEXT PRIMARY KEY,
            code TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            isActive INTEGER DEFAULT 1,
            sortOrder INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS "Match" (
            id TEXT PRIMARY KEY,
            matchDate TEXT NOT NULL,
            league TEXT,
            homeTeam TEXT NOT NULL,
            awayTeam TEXT NOT NULL,
            homeScore INTEGER,
            awayScore INTEGER,
            result TEXT,
            status TEXT DEFAULT 'SCHEDULED',
            createdAt TEXT,
            updatedAt TEXT
        );
        CREATE TABLE IF NOT EXISTS MatchOdds (
            id TEXT PRIMARY KEY,
            matchId TEXT NOT NULL,
            bookmakerId TEXT NOT NULL,
            oddsType TEXT NOT NULL,
            openingOdds REAL,
            closingOdds REAL,
            createdAt TEXT,
            updatedAt TEXT
        );
    """)
    conn.commit()
    return conn

def seed_bookmakers(conn):
    bookmakers = [
        (1, 'Bet365', 'OA-1'), (2, 'Pinnacle', 'OA-2'), (3, 'Betfair', 'OA-3'),
        (4, 'Bwin', 'OA-4'), (5, 'Unibet', 'OA-5'), (6, '1xBet', 'OA-6'),
        (7, 'İddaa', 'OA-7')
    ]
    for sort, name, code in bookmakers:
        existing = conn.execute('SELECT id FROM Bookmaker WHERE code = ?', (code,)).fetchone()
        if not existing:
            bid = str(uuid.uuid4())
            conn.execute('INSERT INTO Bookmaker (id, code, name, isActive, sortOrder) VALUES (?, ?, ?, 1, ?)',
                        (bid, code, name, sort))
    conn.commit()

def find_or_create_match(conn, home_team, away_team, league, match_date):
    date_str = match_date.strftime('%Y-%m-%d')
    existing = conn.execute(
        'SELECT id FROM "Match" WHERE homeTeam = ? AND awayTeam = ? AND date(matchDate) = ? LIMIT 1',
        (home_team, away_team, date_str)
    ).fetchone()
    if existing:
        return existing['id']
    mid = str(uuid.uuid4())
    now = datetime.now().isoformat()
    conn.execute(
        'INSERT INTO "Match" (id, matchDate, league, homeTeam, awayTeam, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        (mid, match_date.isoformat(), league, home_team, away_team, 'SCHEDULED', now, now)
    )
    conn.commit()
    return mid

def upsert_odds(conn, match_id, bookmaker_name, odds_type, closing_odds):
    bm = conn.execute('SELECT id FROM Bookmaker WHERE name LIKE ? OR code = ?',
                      (f'%{bookmaker_name}%', bookmaker_name)).fetchone()
    if not bm:
        return
    bookmaker_id = bm['id']
    existing = conn.execute(
        'SELECT id FROM MatchOdds WHERE matchId = ? AND bookmakerId = ? AND oddsType = ? ORDER BY createdAt DESC LIMIT 1',
        (match_id, bookmaker_id, odds_type)
    ).fetchone()
    now = datetime.now().isoformat()
    if existing:
        conn.execute('UPDATE MatchOdds SET closingOdds = ?, updatedAt = ? WHERE id = ?',
                     (closing_odds, now, existing['id']))
    else:
        oid = str(uuid.uuid4())
        conn.execute(
            'INSERT INTO MatchOdds (id, matchId, bookmakerId, oddsType, openingOdds, closingOdds, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            (oid, match_id, bookmaker_id, odds_type, closing_odds, closing_odds, now, now)
        )
    conn.commit()

def parse_and_save(data, conn):
    saved = 0
    for event in data:
        try:
            home_team = event.get('home_team', 'Unknown')
            away_team = event.get('away_team', 'Unknown')
            league = event.get('sport_title', 'Unknown')
            commence_time = event.get('commence_time', '')
            match_date = datetime.fromisoformat(commence_time.replace('Z', '+00:00')) if commence_time else datetime.now()
            
            match_id = find_or_create_match(conn, home_team, away_team, league, match_date)
            
            for bm in event.get('bookmakers', []):
                bm_name = bm.get('title', '')
                for market in bm.get('markets', []):
                    if market['key'] == 'h2h':
                        outcomes = market.get('outcomes', [])
                        odds_map = {'home': 'MS1', 'draw': 'MSX', 'away': 'MS2'}
                        for outcome in outcomes:
                            odds_type = odds_map.get(outcome.get('name', '').lower(), '')
                            if odds_type:
                                odds_value = float(outcome.get('price', 0))
                                upsert_odds(conn, match_id, bm_name, odds_type, odds_value)
                                saved += 1
        except Exception as e:
            logger.error(f"Error parsing event: {e}")
    return saved

def main():
    logger.info("=== One-Shot Scrape ===")
    
    api_key = os.getenv('THE_ODDS_API_KEY', '')
    if not api_key:
        logger.error("THE_ODDS_API_KEY not set in .env")
        return
    
    tracker = CreditTracker()
    usage = tracker.get_usage()
    logger.info(f"Credit usage: {usage['monthly_used']}/500 ({usage['remaining']} remaining)")
    
    if not tracker.can_make_request(1):
        logger.error(f"Monthly credit limit reached! Used: {usage['monthly_used']}/500")
        return
    
    conn = init_db()
    seed_bookmakers(conn)
    
    logger.info(f"Fetching soccer odds...")
    client = OddsAPIClient(api_key=api_key)
    data = client.fetch_theoddsapi(sport='soccer')
    if data:
        saved = parse_and_save(data, conn)
        logger.info(f"Saved {saved} odds records")
    else:
        logger.warning("No data returned")
    
    match_count = conn.execute('SELECT COUNT(*) as c FROM "Match"').fetchone()['c']
    odds_count = conn.execute('SELECT COUNT(*) as c FROM MatchOdds').fetchone()['c']
    logger.info(f"Database: {match_count} matches, {odds_count} odds")
    
    usage = tracker.get_usage()
    logger.info(f"Final credit usage: {usage['monthly_used']}/500")
    
    conn.close()
    logger.info("Done!")

if __name__ == '__main__':
    main()
