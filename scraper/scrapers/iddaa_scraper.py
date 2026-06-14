from .base_scraper import BaseScraper
import requests
from fake_useragent import UserAgent
from bs4 import BeautifulSoup


class IddaaScraper(BaseScraper):
    def scrape_upcoming_odds(self) -> list[dict]:
        """Scrape İddaa odds from the official website."""
        ua = UserAgent()
        headers = {'User-Agent': ua.random}

        try:
            response = requests.get(
                'https://www.iddaa.com/futbol',
                headers=headers,
                timeout=10
            )
            if response.status_code != 200:
                return []

            soup = BeautifulSoup(response.text, 'lxml')
            matches = []
            return matches
        except Exception as e:
            print(f"Error scraping İddaa: {e}")
            return []

    def scrape_live_odds(self) -> list[dict]:
        return []
