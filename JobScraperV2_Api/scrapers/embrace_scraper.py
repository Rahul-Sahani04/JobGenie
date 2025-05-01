if __name__ == "__main__":
    from base_scraper import JobScraper
else:
    from scrapers.base_scraper import JobScraper

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time
import random
import pandas as pd
import os

class EmbraceScraper(JobScraper):
    
    def __init__(self):
        super().__init__()
        self.url = "https://www.embracesoftwareinc.com/career/"
        self.company = "Embrace Software Inc."
        
    def search_jobs(self, keyword, location, experience_level, num_jobs=10):
        driver = self.get_selenium_driver()
        driver.get(self.url)
        time.sleep(3)
        job_cards = driver.find_elements(By.CLASS_NAME, "rec-job-info")
        print(len(job_cards))
        jobs = []
        for job_card in job_cards:
            job = {}
            
            job_link = job_card.find_element(By.TAG_NAME, "a")
            url = job_link.get_attribute("href")

            
            # Open job link in new tab
            driver.execute_script("window.open('');")
            driver.switch_to.window(driver.window_handles[1])
            time.sleep(1)
            driver.get(url)
            
            
            
            wait = WebDriverWait(driver, 10)
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "cw-jobheader-info")))
            
            
            job_header = driver.find_element(By.CLASS_NAME, "cw-jobheader-info")
            job["title"] = job_header.find_element(By.TAG_NAME, "h1").text
            job["location"] = job_header.find_element(By.CLASS_NAME, "cw-fa-globe-icon").text
            job["posted_date"] = job_header.find_elements(By.CLASS_NAME, "cw-small-size")[1].text.replace("Posted on ", "")
            job["posted_date"] = job["posted_date"].replace("|", "").strip()
            
            job["description"] = driver.find_element(By.CLASS_NAME, "cw-jobdescription").text
            job["company"] = self.company
            job["summary"] = driver.find_element(By.CLASS_NAME, "cw-summary").text
            job["url"] = url
            
            jobs.append(job)
            
            driver.close()
            driver.switch_to.window(driver.window_handles[0])
            
        return jobs
    
        
    
    
    
if __name__ == "__main__":
    scraper = EmbraceScraper()
    jobs = scraper.search_jobs("software", "Toronto", "entry-level", 10)
    print(jobs)
    
    # Save to csv
    df = pd.DataFrame(jobs)
    df.to_csv("results/embrace_jobs.csv", index=False)
    