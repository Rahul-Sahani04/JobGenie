from loguru import logger

if __name__ == "__main__":
    from base_scraper import JobScraper
else:
    from scrapers.base_scraper import JobScraper

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random

class FoundItScraper(JobScraper):
    MAX_RETRIES = 3

    def search_jobs(self, keyword, location, experience_level, num_jobs=10):
        retries = 0
        self.jobs = []  # Ensure jobs list is initialized

        while retries < self.MAX_RETRIES:
            try:
                # Random delay before retrying
                if retries > 0:
                    time.sleep(random.uniform(2, 5))

                if "1" in experience_level:
                    experience_level = 1
                elif "2" in experience_level:
                    experience_level = 2
                elif "3" in experience_level:
                    experience_level = 3

                driver = self.get_selenium_driver()
                keyword = keyword.replace(" ", "+")
                url = f"https://www.foundit.in/srp/results?query={keyword}&locations={location}&experience={experience_level}&jobFreshness=30"

                driver.get(url)

                # Wait for job cards to be present
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "srpResultCard"))
                )

                job_cards_container = driver.find_element(
                    By.CLASS_NAME, "srpResultCard"
                )
                job_cards = job_cards_container.find_elements(
                    By.CLASS_NAME, "srpResultCardContainer"
                )

                # Remove query-details-container from job_cards
                job_cards = [
                    card
                    for card in job_cards
                    if card.get_attribute("class") != "query-details-container"
                ]

                if not job_cards:
                    logger.warning(f"No job cards found for {location}, retrying...")
                    retries += 1
                    continue  # Retry if no jobs found

                # If jobs are found, process them
                for i, card in enumerate(job_cards[:num_jobs]):  # Limit to requested num_jobs
                    try:
                        time.sleep(random.uniform(0.5, 1.5))
                        logger.info(f"Parsing Indeed job card {i+1}/{num_jobs}...")

                        if i != 0:
                            # Scroll to the card
                            driver.execute_script("arguments[0].scrollIntoView(true);", card)
                            time.sleep(random.uniform(0.5, 1.5))
                            # Scroll up a bit
                            driver.execute_script("window.scrollBy(0, -175);")
                            time.sleep(random.uniform(0.5, 1.5))
                            card.click()
                        time.sleep(random.uniform(2.5, 3.5))

                        WebDriverWait(driver, 10).until(
                            EC.presence_of_element_located((By.CLASS_NAME, "srpJdContainer"))
                        )

                        jobComponent = driver.find_element(By.CLASS_NAME, "srpJdContainer")

                        title_elem = jobComponent.find_element(By.CLASS_NAME, "jdTitle")
                        title = title_elem.text.strip() if title_elem else "Title not found"

                        company_elem = jobComponent.find_element(By.CLASS_NAME, "jdCompanyName")
                        company = company_elem.text.strip() if company_elem else "Company not specified"
                        companyURL = company_elem.get_attribute("href") if company_elem else None

                        highlights = jobComponent.find_element(By.CLASS_NAME, "jdHighlights")
                        highlights = highlights.find_elements(By.TAG_NAME, "div")

                        # Remove duplicates from highlights based on text content
                        seen_texts = set()
                        unique_highlights = []
                        for highlight in highlights:
                            text = highlight.text.strip()
                            if text not in seen_texts:
                                seen_texts.add(text)
                                unique_highlights.append(highlight)
                        highlights = unique_highlights

                        for i, h in enumerate(highlights):
                            logger.debug(f"Highlight {i}: {h.text}")

                        experience_level = highlights[0].find_element(By.TAG_NAME, "div").text.strip() if highlights else "Experience not specified"
                        job_location = highlights[1].text.strip() if highlights else "Location not specified"

                        job_desc = jobComponent.find_element(By.ID, "jobDescription").text
                        if "Description: Job Description" in job_desc:
                            job_desc = job_desc.replace("Description: Job Description", "")

                        job_link = driver.current_url

                        self.jobs.append({
                            "title": title,
                            "company": company,
                            "location": job_location,
                            "url": job_link,
                            "description": job_desc,
                            "experience": experience_level,
                            "source": "FoundIt",
                        })

                    except Exception as e:
                        logger.error(f"Error parsing Indeed job card: {str(e)[:150]}")
                        continue

                # If jobs are found, break out of the retry loop
                if self.jobs:
                    logger.success(f"Successfully fetched {len(self.jobs)} jobs for {location}")
                    break

            except Exception as e:
                logger.error(f"Error with Indeed scraper for {location}: {str(e)}")
                retries += 1

            finally:
                if "driver" in locals():
                    driver.quit()  # Ensure driver quits at the end of each attempt

        if not self.jobs:
            logger.error(f"Failed to fetch Indeed jobs for {location} after {self.MAX_RETRIES} attempts")

        return self.jobs

if __name__ == "__main__":
    scraper = FoundItScraper()
    jobs = scraper.search_jobs("Intern", "Delhi", "1 years", 2)
    logger.info(f"Fetched jobs: {jobs}")
    logger.info(f"Total jobs fetched: {len(jobs)}")
    