from .base_scraper import BaseScraper
import requests
from fake_useragent import UserAgent


class Bet365Scraper(BaseScraper):
    def scrape_live_odds(self) -> list[dict]:
        """Scrape live odds from Bet365."""
        return []

    def scrape_upcoming_odds(self) -> list[dict]:
        """Scrape upcoming match odds."""
        return []


def get_bet365_odds() -> list[dict]:
    """Convenience function."""
    scraper = Bet365Scraper({
        'name': 'Bet365',
        'code': 'OA-1',
        'base_url': 'https://www.bet365.com'
    })
    return scraper.scrape_upcoming_odds()
