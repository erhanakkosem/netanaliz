from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional


class BaseScraper(ABC):
    def __init__(self, bookmaker_config: dict):
        self.name = bookmaker_config['name']
        self.code = bookmaker_config['code']
        self.base_url = bookmaker_config['base_url']

    @abstractmethod
    def scrape_live_odds(self) -> list[dict]:
        """Scrape current odds for live matches."""
        pass

    @abstractmethod
    def scrape_upcoming_odds(self) -> list[dict]:
        """Scrape odds for upcoming matches."""
        pass

    def parse_odds_value(self, value: str) -> Optional[float]:
        """Parse odds string to float."""
        try:
            return float(value.replace(',', '.'))
        except (ValueError, AttributeError):
            return None

    def get_match_result(self, home_score: int, away_score: int) -> str:
        """Determine match result (MS1, MSX, MS2)."""
        if home_score > away_score:
            return 'MS1'
        elif home_score < away_score:
            return 'MS2'
        return 'MSX'


def extract_odds_data(html: str, selector: str) -> list[dict]:
    """Extract odds data from HTML using CSS selector."""
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, 'lxml')
    results = []
    for element in soup.select(selector):
        pass
    return results
