from loguru import logger

if __name__ == "__main__":
    from base_scraper import JobScraper
else:
    from scrapers.base_scraper import JobScraper

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time
import random


class LinkedInScraper(JobScraper):
    MAX_RETRIES = 3
    WAIT_TIME = 10

    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.2420.81",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux i686; rv:124.0) Gecko/20100101 Firefox/124.0",
    ]

    def search_jobs(self, keyword, location, experience_level, num_jobs=10):
        retries = 0
        while retries < self.MAX_RETRIES:
            driver = self.get_selenium_driver()
            try:
                # Random delay between attempts
                if retries > 0:
                    time.sleep(random.uniform(2, 5))

                # Add random delay to avoid detection
                time.sleep(random.uniform(1, 3))

                base_url = f"https://www.linkedin.com/jobs/search?keywords={keyword}&location={location}&f_TPR=r2592000&f_E=2"
                driver.get(base_url)

                # Wait for job cards to load with increased timeout
                try:
                    wait = WebDriverWait(driver, self.WAIT_TIME)

                    if wait.until(
                        EC.presence_of_element_located(
                            (By.CSS_SELECTOR, "#base-contextual-sign-in-modal > div")
                        )
                    ):
                        logger.info("LinkedIn modal detected, closing...")
                        driver.find_element(
                            By.CSS_SELECTOR,
                            "#base-contextual-sign-in-modal > div > section > button",
                        ).click()

                    job_list = wait.until(
                        EC.presence_of_element_located(
                            (By.CLASS_NAME, "jobs-search__results-list")
                        )
                    )
                    logger.info("LinkedIn job cards loaded")
                    job_cards = job_list.find_elements(By.TAG_NAME, "li")
                except TimeoutException:
                    logger.warning(
                        f"Timeout waiting for LinkedIn jobs in {location}. Retrying..."
                    )
                    retries += 1
                    driver.quit()
                    continue

                # Add random delay between card processing
                for card in job_cards[:num_jobs]:
                    try:
                        logger.info("Parsing LinkedIn job card...")
                        card.click()

                        time.sleep(random.uniform(2.5, 3.5))
                        # Wait for the detail view to be present for each card
                        all_details = wait.until(
                            EC.presence_of_element_located(
                                (By.CLASS_NAME, "two-pane-serp-page__detail-view")
                            )
                        )

                        # Click the "Show more" button to get the full job description
                        driver.find_element(
                            By.CLASS_NAME, "show-more-less-html__button"
                        ).click()
                        time.sleep(random.uniform(0.5, 1.5))

                        title = all_details.find_element(
                            By.CLASS_NAME, "top-card-layout__title"
                        ).text
                        logger.debug(f"Title: {title}")
                        company = all_details.find_element(
                            By.CLASS_NAME, "topcard__org-name-link"
                        ).text
                        logger.debug(f"Company: {company}")
                        location = all_details.find_element(
                            By.CLASS_NAME, "topcard__flavor--bullet"
                        ).text
                        logger.debug(f"Location: {location}")

                        url = card.find_element(By.TAG_NAME, "a").get_attribute("href")

                        logger.debug(f"URL: {url}")

                        job_desc = all_details.find_element(
                            By.CLASS_NAME, "decorated-job-posting__details"
                        ).text

                        logger.info(
                            f"Added job: {title or 'N/A'}, {company or 'N/A'}, {location or 'N/A'}, {url or 'N/A'}"
                        )

                        self.jobs.append(
                            {
                                "title": title or "N/A",
                                "company": company or "N/A",
                                "location": location or "N/A",
                                "url": url or "N/A",
                                "description": job_desc or "N/A",
                                "source": "LinkedIn",
                            }
                        )
                    except (NoSuchElementException, Exception) as e:
                        logger.error(f"Error parsing LinkedIn job card: {str(e)}")
                        continue

                # If we successfully got jobs, break the retry loop
                break

            except Exception as e:
                logger.error(f"Error with LinkedIn scraper in {location}: {str(e)}")
                retries += 1

            finally:
                driver.quit()
                break

        if retries == self.MAX_RETRIES:
            logger.error(
                f"Failed to fetch LinkedIn jobs in {location} after {self.MAX_RETRIES} attempts"
            )

        return self.jobs


if __name__ == "__main__":
    scraper = LinkedInScraper()
    jobs = scraper.search_jobs("Finance", "Mumbai", "1", 2)
    logger.info(f"Fetched jobs: {jobs}")
    logger.info(f"Total jobs fetched: {len(jobs)}")
