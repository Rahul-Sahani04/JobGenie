import requests
from bs4 import BeautifulSoup
from datetime import datetime

def scrape():
    url = "https://www.shine.com/job-search/"  # Example URL, adjust as needed
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        soup = BeautifulSoup(response.content, 'html.parser')

        job_listings = []
        # Example: Adjust selectors based on Shine's actual structure
        for job in soup.find_all('div', class_='job_listing'):
            title_element = job.find('a', class_='job_title')
            company_element = job.find('span', class_='company_name')
            location_element = job.find('span', class_='location')
            link_element = title_element['href'] if title_element else None

            title = title_element.text if title_element else None
            company = company_element.text if company_element else None
            location = location_element.text if location_element else None

            job_listings.append({
                'title': title,
                'company': company,
                'location': location,
                'link': link_element,
                'platform': 'Shine',
                'posted_date': datetime.now().date(),  # Example: Today's date
                'description': 'N/A'  # You might need to scrape the job description from the link
            })
        return job_listings
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

if __name__ == '__main__':
    jobs = scrape()
    print(jobs)
