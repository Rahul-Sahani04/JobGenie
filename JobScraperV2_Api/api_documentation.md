# Job Aggregator API Documentation

## Endpoints

### `/jobs`

*   **Description:** Retrieves job postings from the aggregated database.
*   **Methods:** `GET`
*   **Parameters:**
    *   `query` (optional): Filter jobs by title or description (e.g., `software engineer`).
    *   `platform` (optional): Filter jobs by platform (e.g., `Naukri`, `Shine`).
    *   `location` (optional): Filter jobs by location (e.g., `Bangalore`).
*   **Example Input:**

    `http://127.0.0.1:5000/jobs?query=software%20engineer&platform=Naukri&location=Bangalore`
*   **Example Output:**

    ```json
    [
        {
            "id": 1,
            "title": "Software Engineer",
            "company": "ABC Corp",
            "location": "Bangalore",
            "platform": "Naukri",
            "url": "https://www.naukri.com/job/123",
            "description": "Job description...",
            "date_posted": "N/A"
        },
        {
            "id": 2,
            "title": "Software Engineer",
            "company": "XYZ Ltd",
            "location": "Bangalore",
            "platform": "Naukri",
            "url": "https://www.naukri.com/job/456",
            "description": "Job description...",
            "date_posted": "N/A"
        }
    ]

### `/all_jobs`

*   **Description:** Retrieves all job postings from the database with a limit.
*   **Methods:** `GET`
*   **Parameters:**
    *   `limit` (optional): Maximum number of jobs to retrieve (default: 10).
*   **Example Input:**

    `http://127.0.0.1:5000/all_jobs?limit=20`
*   **Example Output:**

    ```json
    [
        {
            "id": 1,
            "title": "Software Engineer",
            "company": "ABC Corp",
            "location": "Bangalore",
            "platform": "Naukri",
            "url": "https://www.naukri.com/job/123",
            "description": "Job description...",
            "date_posted": "N/A"
        },
        {
            "id": 2,
            "title": "Software Engineer",
            "company": "XYZ Ltd",
            "location": "Bangalore",
            "platform": "Naukri",
            "url": "https://www.naukri.com/job/456",
            "description": "Job description...",
            "date_posted": "N/A"
        },
        // ... more jobs
    ]
    ```