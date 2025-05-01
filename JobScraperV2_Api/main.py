import sqlite3
import requests
from bs4 import BeautifulSoup
import time
import logging
import os
import json

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

CACHE_DIR = 'cache'
if not os.path.exists(CACHE_DIR):
    os.makedirs(CACHE_DIR)

def get_cache(url):
    cache_file = os.path.join(CACHE_DIR, url.replace('/', '_').replace(':', '_') + '.json')
    if os.path.exists(cache_file):
        with open(cache_file, 'r') as f:
            logging.info(f"Cache hit for {url}")
            return json.load(f)
    return None

def set_cache(url, data):
    cache_file = os.path.join(CACHE_DIR, url.replace('/', '_').replace(':', '_') + '.json')
    with open(cache_file, 'w') as f:
        json.dump(data, f)
        logging.info(f"Cache set for {url}")

# Database setup
DATABASE_NAME = 'jobs.db'

def create_table():
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            company TEXT,
            location TEXT,
            platform TEXT,
            url TEXT,
            description TEXT,
            date_posted TEXT
        )
    """)
    conn.commit()
    conn.close()

def scrape_naukri(query, pages=1):
    jobs = []
    for page in range(1, pages + 1):
        url = f"https://www.naukri.com/{query}-jobs-{page}"
        cached_data = get_cache(url)
        if cached_data:
            jobs.extend(cached_data)
            continue

        logging.info(f"Scraping Naukri: {url}")
        try:
            response = requests.get(url)
            response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
            soup = BeautifulSoup(response.content, 'html.parser')
            job_cards = soup.find_all('article', class_='jobTuple')
            page_jobs = []
            for card in job_cards:
                title_element = card.find('a', class_='title')
                company_element = card.find('a', class_='subTitle ellipsis')
                location_element = card.find('li', class_='location')
                desc_element = card.find('div', class_='job-description')
                date_element = card.find('div', class_='jobTupleFooter')
                
                title = title_element.text if title_element else "N/A"
                company = company_element.text if company_element else "N/A"
                location = location_element.text if location_element else "N/A"
                url = title_element['href'] if title_element else "N/A"
                description = desc_element.text if desc_element else "N/A"
                date_posted = date_element.find('span', class_='fleft date').text if date_element and date_element.find('span', class_='fleft date') else "N/A"

                job = {
                    'title': title,
                    'company': company,
                    'location': location,
                    'platform': 'Naukri',
                    'url': url,
                    'description': description,
                    'date_posted': date_posted
                }
                page_jobs.append(job)
            jobs.extend(page_jobs)
            set_cache(url, page_jobs)
        except requests.exceptions.RequestException as e:
            logging.error(f"Request error for {url}: {e}")
        except Exception as e:
            logging.error(f"Error scraping Naukri: {e}")
        time.sleep(1)  # Be polite and rate limit your requests
    return jobs

def scrape_shine(query, pages=1):
    jobs = []
    for page in range(1, pages + 1):
        url = f"https://www.shine.com/job-search/{query}-jobs-{page}"
        cached_data = get_cache(url)
        if cached_data:
            jobs.extend(cached_data)
            continue

        logging.info(f"Scraping Shine: {url}")
        try:
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            job_cards = soup.find_all('div', class_='jobCard_jobCard__0j9ht')
            page_jobs = []
            for card in job_cards:
                title_element = card.find('h2')
                company_element = card.find('div', class_='jobCard_jobCard_cName__mYPAK')
                location_element = card.find('li', class_='jobCard_jobCard_location__Nl8e9')
                url_element = card.find('a', class_='jobCard_jobCard_jobTitle__x440M')
                desc_element = card.find('div', class_='jobCard_jobCard_jdSection__mHYPE')

                title = title_element.text if title_element else "N/A"
                company = company_element.text if company_element else "N/A"
                location = location_element.text if location_element else "N/A"
                url = "https://www.shine.com" + url_element['href'] if url_element else "N/A"
                description = desc_element.text if desc_element else "N/A"
                date_posted = "N/A" # Shine doesn't have date posted in this format

                job = {
                    'title': title,
                    'company': company,
                    'location': location,
                    'platform': 'Shine',
                    'url': url,
                    'description': description,
                    'date_posted': date_posted
                }
                page_jobs.append(job)
            jobs.extend(page_jobs)
            set_cache(url, page_jobs)
        except requests.exceptions.RequestException as e:
            logging.error(f"Request error for {url}: {e}")
        except Exception as e:
            logging.error(f"Error scraping Shine: {e}")
        time.sleep(1)
    return jobs

def store_job(job):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO jobs (title, company, location, platform, url, description, date_posted)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (job['title'], job['company'], job['location'], job['platform'], job['url'], job['description'], job['date_posted']))
        conn.commit()
        logging.info(f"Stored job: {job['title']} - {job['company']} from {job['platform']}")
    except sqlite3.IntegrityError:
        logging.warning(f"Duplicate job found: {job['title']} - {job['url']}")
    except Exception as e:
        logging.error(f"Error storing job: {job['title']} - {job['url']} - {e}")
    finally:
        conn.close()

def main():
    create_table()
    query = "software engineer"  # Example query
    logging.info(f"Starting scraping for query: {query}")
    
    # Scrape Naukri
    naukri_jobs = scrape_naukri(query, pages=2)
    if naukri_jobs:
        for job in naukri_jobs:
            store_job(job)
    
    # Scrape Shine
    shine_jobs = scrape_shine(query, pages=2)
    if shine_jobs:
        for job in shine_jobs:
            store_job(job)
    
    logging.info("Scraping completed.")

from flask import Flask, jsonify, request

app = Flask(__name__)

# Allow CORS for all routes
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

@app.route('/')
def index():
    return "Welcome to the Job Scraper API!"

@app.route('/jobs', methods=['GET'])
def get_jobs():
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    
    query = request.args.get('query')
    platform = request.args.get('platform')
    location = request.args.get('location')
    
    sql_query = "SELECT * FROM jobs WHERE 1=1"
    params = []
    
    if query:
        sql_query += " AND (title LIKE ? OR description LIKE ?)"
        params.append(f"%{query}%")
        params.append(f"%{query}%")
    if platform:
        sql_query += " AND platform = ?"
        params.append(platform)
    if location:
        sql_query += " AND location LIKE ?"
        params.append(f"%{location}%")
    
    cursor.execute(sql_query, params)
    jobs = cursor.fetchall()
    
    job_list = []
    for job in jobs:
        job_dict = {
            'id': job[0],
            'title': job[1],
            'company': job[2],
            'location': job[3],
            'platform': job[4],
            'url': job[5],
            'description': job[6],
            'date_posted': job[7]
        }
        job_list.append(job_dict)
    
    conn.close()
    return jsonify(job_list)

@app.route('/all_jobs', methods=['GET'])
def get_all_jobs():
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    limit = request.args.get('limit', default=10, type=int)

    sql_query = "SELECT * FROM jobs LIMIT ?"
    cursor.execute(sql_query, (limit,))
    jobs = cursor.fetchall()

    job_list = []
    for job in jobs:
        job_dict = {
            'id': job[0],
            'title': job[1],
            'company': job[2],
            'location': job[3],
            'platform': job[4],
            'url': job[5],
            'description': job[6],
            'date_posted': job[7]
        }
        job_list.append(job_dict)

    conn.close()
    return jsonify(job_list)

if __name__ == "__main__":
    create_table()
    # You can uncomment the following lines to run the scraper when the API starts
    # query = "software engineer"  # Example query
    # logging.info(f"Starting scraping for query: {query}")
    # naukri_jobs = scrape_naukri(query, pages=2)
    # if naukri_jobs:
    #     for job in naukri_jobs:
    #         store_job(job)
    # shine_jobs = scrape_shine(query, pages=2)
    # if shine_jobs:
    #     for job in shine_jobs:
    #         store_job(job)
    # logging.info("Scraping completed.")
    app.run(debug=True)