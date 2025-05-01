if __name__ == "__main__":
    from base_scraper import JobScraper
else:
    from scrapers.base_scraper import JobScraper
    
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import random

class IndeedScraper(JobScraper):
    MAX_RETRIES = 3
    
    def search_jobs(self, keyword, location, experience_level, num_jobs=10):
        retries = 0
        self.jobs = []  # Ensure jobs list is initialized
        
        while retries < self.MAX_RETRIES:
            try:
                # Random delay before retrying
                if retries > 0:
                    time.sleep(random.uniform(2, 5))
                    
                if experience_level == '1':
                    experience_level = 'ENTRY_LEVEL'
                elif experience_level == '2':
                    experience_level = 'MID_LEVEL'
                elif experience_level == '3':
                    experience_level = 'SENIOR_LEVEL'
                
                driver = self.get_selenium_driver()
                keyword = keyword.replace(' ', '+')
                url = f"https://www.indeed.com/jobs?q={keyword}&l={location}&sort=date&from=searchOnDesktopSerp&fromage=3"
                
                driver.get(url)
                
                # Wait for job cards to be present
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "job_seen_beacon"))
                )
                
                job_cards_container = driver.find_element(By.CLASS_NAME, "mosaic-provider-jobcards")
                job_cards = job_cards_container.find_elements(By.TAG_NAME, 'li')
                
                if not job_cards:
                    print(f"No job cards found for {location}, retrying...")
                    retries += 1
                    continue  # Retry if no jobs found
                
                # If jobs are found, process them
                for i, card in enumerate(job_cards[:num_jobs]):  # Limit to requested num_jobs
                    try:
                        time.sleep(random.uniform(0.5, 1.5))
                        print(f"Parsing Indeed job card {i+1}/{num_jobs}...")
                        
                        if i != 0:
                            card.click()
                        time.sleep(random.uniform(2.5, 3.5))
                        
                        WebDriverWait(driver, 10).until(
                            EC.presence_of_element_located((By.CLASS_NAME, "jobsearch-RightPane"))
                        )
                        
                        jobComponent = driver.find_element(By.CLASS_NAME, "jobsearch-RightPane")
                        
                        title_elem = jobComponent.find_element(By.CLASS_NAME, 'jobsearch-JobInfoHeader-title')
                        title = title_elem.text.strip() if title_elem else "Title not found"
                        
                        company_elem = jobComponent.find_element(By.TAG_NAME, 'a')
                        company = company_elem.text.strip() if company_elem else "Company not specified"
                        companyURL = company_elem.get_attribute('href') if company_elem else None
                        
                        location_elem = jobComponent.find_element(By.CSS_SELECTOR, 'div[data-testid="inlineHeader-companyLocation"]')
                        job_location = location_elem.text.strip() if location_elem else location
                        
                        job_desc = jobComponent.find_element(By.ID, 'jobDescriptionText').text
                        job_link = card.find_element(By.TAG_NAME, 'a').get_attribute('href') or driver.current_url
                        
                        print(f"Title: {title}, Company: {company}, Location: {job_location}, Link: {job_link}")
                        
                        with open('results/indeed_jobs.txt', 'a') as f:
                            f.write(f"Title: {title}\nCompany: {company}\nLocation: {job_location}\nLink: {job_link}\n\n")
                            f.write(f"Description: {job_desc}\n\n")
                            f.write("=" * 50 + "\n\n")
                
                        self.jobs.append({
                            'title': title,
                            'company': company,
                            'location': job_location,
                            'link': job_link,
                            'description': job_desc,
                            'source': 'Indeed'
                        })
                        
                    except Exception as e:
                        print(f"Error parsing Indeed job card: {str(e)[:150]}")
                        continue
                
                # If jobs are found, break out of the retry loop
                if self.jobs:
                    print(f"Successfully fetched {len(self.jobs)} jobs for {location}")
                    break
            
            except Exception as e:
                print(f"Error with Indeed scraper for {location}: {str(e)}")
                retries += 1
            
            finally:
                if 'driver' in locals():
                    driver.quit()  # Ensure driver quits at the end of each attempt
        
        if not self.jobs:
            print(f"Failed to fetch Indeed jobs for {location} after {self.MAX_RETRIES} attempts")
            
        return self.jobs


if __name__ == '__main__':
    scraper = IndeedScraper()
    jobs = scraper.search_jobs('Intern', 'Delhi', '1 years', 2)
    print(jobs)
    print(len(jobs))