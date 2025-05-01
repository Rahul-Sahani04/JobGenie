import os
import sys
import pandas as pd
import asyncio
import datetime
from loguru import logger
from dotenv import load_dotenv
from scrapers.naukri_scraper import NaukriScraper
from google_api.google_sheets_extractor import (
    get_google_sheets_data,
    extract_course_with_locations,
)
from mailer.generate_email_jobs import generate_jobs

# Load environment variables
load_dotenv()

# Constants
JOBS_SCRAPED_CSV = "results/jobs_scraped.csv"
EMAIL_JOBS_CSV = "mailer/email_jobs.csv"
SPREADSHEET_ID = "10LL7JkuHesH0VrIq2oiD93iZKTEWd-3nMhpwmVdVCco"
REMOTE_LOCATIONS = {"anywhere", "india", "pan-india", "work from home", "wfh", "remote"}
MAX_CONCURRENT_TASKS = 8
SAVE_THRESHOLD = 50  # Number of jobs to save at a time

# Ensure results directory exists
os.makedirs("results", exist_ok=True)

# Remove old jobs file if older than 7 days
if os.path.exists(JOBS_SCRAPED_CSV):
    file_age = os.path.getmtime(JOBS_SCRAPED_CSV)
    if datetime.datetime.now().timestamp() - file_age > 604800:  # 7 days
        logger.info("Deleting old jobs_scraped.csv")
        os.remove(JOBS_SCRAPED_CSV)

# Create CSV with headers if missing
if not os.path.exists(JOBS_SCRAPED_CSV):
    with open(JOBS_SCRAPED_CSV, "w") as f:
        f.write(
            "title,company,location,url,experience,salary,description,source,scrape_date,job_type,keywords\n"
        )

# Fetch student data from Google Sheets
google_data = get_google_sheets_data(SPREADSHEET_ID, ["Form responses 1"])
course_with_locations = extract_course_with_locations(["Form responses 1"])
course_with_locations.to_csv(EMAIL_JOBS_CSV, index=False)

# Generate email jobs
generate_jobs()

# Load email jobs
email_jobs = pd.read_csv(EMAIL_JOBS_CSV)
# shine_jobs = email_jobs.iloc[1::2].to_dict("records")  # Odd rows

naukri_jobs = email_jobs.to_dict("records")  # Even rows

logger.info(f"Naukri jobs: {len(naukri_jobs)}")

async def fetch_jobs_with_scraper(scraper, jobs, semaphore):
    """Runs scraper asynchronously for assigned jobs."""
    async with semaphore:
        tasks = [
            asyncio.to_thread(
                scraper.search_jobs,
                job["Course Name"],
                (
                    job["State/Location"].strip().lower()
                    if job["State/Location"].strip().lower() not in REMOTE_LOCATIONS
                    else ""
                ),
            )
            for job in jobs
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    # Filter out successful results and log errors
    scraped_jobs = [
        job for result in results if not isinstance(result, Exception) for job in result
    ]
    for result in results:
        if isinstance(result, Exception):
            logger.error(f"Scraping error: {result}")

    return scraped_jobs

async def save_jobs_to_csv(jobs_df, file_path):
    """Saves jobs to CSV and deduplicates."""
    try:
        existing_jobs = pd.read_csv(file_path)
        combined_jobs = pd.concat([existing_jobs, jobs_df])
        # combined_jobs = pd.concat([existing_jobs, jobs_df]).drop_duplicates(
        #     subset=["title", "company", "location", "url"], keep="last"
        # )
    except (FileNotFoundError, pd.errors.EmptyDataError):
        combined_jobs = jobs_df

    combined_jobs.to_csv(file_path, index=False)
    logger.info(f"Saved {len(jobs_df)} jobs to {file_path}")

async def scrape_and_save(scraper, jobs, semaphore):
    """Scrapes jobs and saves results asynchronously."""
    scraped_jobs = []

    for i in range(0, len(jobs), SAVE_THRESHOLD):
        batch_jobs = jobs[i:i + SAVE_THRESHOLD]
        batch_scraped_jobs = await fetch_jobs_with_scraper(scraper, batch_jobs, semaphore)
        scraped_jobs.extend(batch_scraped_jobs)

        if batch_scraped_jobs:
            jobs_df = pd.DataFrame(batch_scraped_jobs)
            jobs_df["scrape_date"] = datetime.datetime.now().strftime("%Y-%m-%d")
            await save_jobs_to_csv(jobs_df, JOBS_SCRAPED_CSV)

    logger.info(
        f"Scraped {len(scraped_jobs)} jobs using {scraper.__class__.__name__}"
    )

async def main():

    semaphore = asyncio.Semaphore(MAX_CONCURRENT_TASKS)
    logger.info("Job scraping started.")

    await asyncio.gather(
        scrape_and_save(NaukriScraper(), naukri_jobs, semaphore),
    )

    logger.info("Job scraping completed.")

if __name__ == "__main__":
    asyncio.run(main())
