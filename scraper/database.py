import sqlite3
import os
import uuid
import logging
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)

class Database:
    def __init__(self, db_path: Optional[str] = None):
        if db_path:
            path = db_path
        else:
            path = os.getenv('DATABASE_URL', 'file:./dev.db')
            if path.startswith('file:'):
                path = path[5:]
            if not os.path.isabs(path):
                path = os.path.join(os.path.dirname(__file__), '..', path)
        
        logger.info(f"Connecting to database: {path}")
        self.conn = sqlite3.connect(path)
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA journal_mode=WAL")
    
    def get_bookmakers(self) -> list[dict]:
        cursor = self.conn.execute(
            'SELECT id, name, code FROM Bookmaker WHERE isActive = 1 ORDER BY sortOrder'
        )
        return [dict(row) for row in cursor.fetchall()]
    
    def get_or_create_bookmaker(self, name: str, code: str) -> int:
        cursor = self.conn.execute('SELECT id FROM Bookmaker WHERE code = ?', (code,))
        row = cursor.fetchone()
        if row:
            return row['id']
        bid = str(uuid.uuid4())
        self.conn.execute(
            'INSERT INTO Bookmaker (id, code, name, isActive, sortOrder) VALUES (?, ?, ?, 1, 0)',
            (bid, code, name)
        )
        self.conn.commit()
        return bid
    
    def find_match(self, home_team: str, away_team: str, match_date: datetime) -> Optional[str]:
        date_str = match_date.strftime('%Y-%m-%d')
        cursor = self.conn.execute(
            '''SELECT id FROM Match 
               WHERE homeTeam = ? AND awayTeam = ? AND date(matchDate) = ?
               LIMIT 1''',
            (home_team, away_team, date_str)
        )
        row = cursor.fetchone()
        return row['id'] if row else None
    
    def find_or_create_match(self, home_team: str, away_team: str, league: str, match_date: datetime) -> str:
        existing = self.find_match(home_team, away_team, match_date)
        if existing:
            return existing
        
        mid = str(uuid.uuid4())
        self.conn.execute(
            '''INSERT INTO Match (id, matchDate, league, homeTeam, awayTeam, status, createdAt, updatedAt)
               VALUES (?, ?, ?, ?, ?, 'SCHEDULED', ?, ?)''',
            (mid, match_date.isoformat(), league, home_team, away_team, 
             datetime.now().isoformat(), datetime.now().isoformat())
        )
        self.conn.commit()
        return mid
    
    def upsert_odds(self, match_id: str, bookmaker_id: str, odds_type: str, 
                    opening_odds: float, closing_odds: float):
        cursor = self.conn.execute(
            '''SELECT id FROM MatchOdds 
               WHERE matchId = ? AND bookmakerId = ? AND oddsType = ?
               ORDER BY createdAt DESC LIMIT 1''',
            (match_id, bookmaker_id, odds_type)
        )
        existing = cursor.fetchone()
        now = datetime.now().isoformat()
        
        if existing:
            self.conn.execute(
                'UPDATE MatchOdds SET closingOdds = ?, updatedAt = ? WHERE id = ?',
                (closing_odds, now, existing['id'])
            )
        else:
            oid = str(uuid.uuid4())
            self.conn.execute(
                '''INSERT INTO MatchOdds (id, matchId, bookmakerId, oddsType, 
                   openingOdds, closingOdds, createdAt, updatedAt)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                (oid, match_id, bookmaker_id, odds_type, opening_odds, closing_odds, now, now)
            )
        self.conn.commit()
    
    def save_match_result(self, match_id: str, home_score: int, away_score: int):
        result = 'MS1' if home_score > away_score else 'MS2' if away_score > home_score else 'MSX'
        self.conn.execute(
            'UPDATE Match SET homeScore = ?, awayScore = ?, result = ?, status = ? WHERE id = ?',
            (home_score, away_score, result, 'FINISHED', match_id)
        )
        self.conn.commit()
    
    def close(self):
        self.conn.close()
