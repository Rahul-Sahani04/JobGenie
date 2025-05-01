import random
from abc import ABC, abstractmethod
from undetected_chromedriver import Chrome, ChromeOptions
from loguru import logger
from datetime import datetime

from recovery.checkpoint_manager import CheckpointManager

from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options


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

class JobScraper(ABC):
    def __init__(self):
        self.jobs = []
        self.driver = None
        self.checkpoint_manager = CheckpointManager()
        self.progress = {
            'processed_jobs': [],
            'failed_jobs': [],
            'last_page': 0,
            'last_keyword': '',
            'last_location': '',
            'stats': {
                'total_processed': 0,
                'total_failed': 0,
                'last_run': None,
                'start_time': datetime.now().isoformat()
            }
        }

    def resume_scraping(self, keyword, location):
        """Resume scraping with enhanced error handling and state management"""
        try:
            checkpoint = self.checkpoint_manager.load_checkpoint()
            if checkpoint and checkpoint.get('scraping_progress'):
                # Validate checkpoint data
                required_fields = ['processed_jobs', 'last_page', 'last_keyword', 'last_location']
                if all(field in checkpoint['scraping_progress'] for field in required_fields):
                    self.progress = checkpoint['scraping_progress']
                    start_page = checkpoint['scraping_progress']['last_page']
                    logger.info(f"Resuming scraping from page {start_page}")
                else:
                    logger.warning("Invalid checkpoint data, starting fresh")
                    start_page = 0
            else:
                logger.info("No checkpoint found, starting fresh scraping session")
                start_page = 0

            # Update stats
            self.progress['stats']['last_run'] = datetime.now().isoformat()
            
            try:
                return self.search_jobs(keyword, location, start_page=start_page)
            except Exception as e:
                self.progress['stats']['total_failed'] += 1
                logger.error(f"Scraping failed: {str(e)}")
                raise
        except Exception as e:
            logger.error(f"Error in resume_scraping: {str(e)}")
            raise
        finally:
            # Always save progress and cleanup
            try:
                self.checkpoint_manager.save_checkpoint({
                    'scraping_progress': self.progress,
                    'timestamp': datetime.now().isoformat()
                })
            except Exception as e:
                logger.error(f"Failed to save checkpoint: {str(e)}")
            
            # self._cleanup()
            
    @abstractmethod
    def search_jobs(self, keyword, location, start_page=0):
        # Update progress tracking
        self.progress['last_keyword'] = keyword
        self.progress['last_location'] = location
        self.progress['last_page'] = start_page

    def _cleanup(self):
        """Clean up resources"""
        try:
            if self.driver:
                self.driver.quit()
                self.driver = None
                # logger.debug("Selenium driver closed successfully")
        except Exception as e:
            logger.error(f"Error during cleanup: {str(e)}")

    def get_selenium_driver(self, use_proxy=False):
        """Get selenium driver with enhanced proxy support and security features"""
        chrome_options = Options()
        chrome_options.add_argument("--headless=new")  # Use this


        if use_proxy:
            try:
                proxies = [
                    "socks5://localhost:9050",  # Default Tor proxy
                    "http://127.0.0.1:8080"     # Default local proxy
                ]
                proxy = random.choice(proxies)
                chrome_options.add_argument(f'--proxy-server={proxy}')
                # Additional proxy settings for better security
                chrome_options.add_argument('--proxy-bypass-list=<-loopback>')
                chrome_options.add_argument('--disable-webrtc-multiple-routes')
                chrome_options.add_argument('--disable-webrtc-hw-encoding')
                chrome_options.add_argument('--disable-webrtc-hw-decoding')
                
                # logger.debug(f"Using proxy: {proxy} with enhanced security settings")
            except Exception as e:
                logger.error(f"Failed to configure proxy: {str(e)}")
                raise

        # Add random user agent
        random_user_agent = random.choice(USER_AGENTS)
        chrome_options.add_argument(f'--user-agent={random_user_agent}')

        # Enhanced browser configuration for stability
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--ignore-certificate-errors")
        chrome_options.add_argument("--allow-running-insecure-content")
        
        # Performance optimizations
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument('--disable-infobars')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        
        # Memory management
        chrome_options.add_argument('--disable-features=TranslateUI')
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-background-networking')
        chrome_options.add_argument('--disk-cache-size=1')
        
        # Timeout and performance settings
        chrome_options.add_argument('--page-load-strategy=normal')
        chrome_options.add_argument('--lang=en-US')
        
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")  # Anti-detection
        

        try:
            # Initialize driver with enhanced settings
            # driver = Chrome(
            #     options=chrome_options, 
            #     headless=True,
            # )
            
            driver = webdriver.Chrome(options=chrome_options)

            # Set page load timeout
            driver.set_page_load_timeout(30)
            driver.implicitly_wait(10)

            # Configure window
            driver.set_window_size(1920, 1080)
            
            # Enhanced anti-detection measures
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            driver.execute_script("window.chrome = { runtime: {} };")
            
            # Additional stealth settings
            driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
                "source": """
                    const newProto = navigator.__proto__
                    delete newProto.webdriver
                    navigator.__proto__ = newProto
                """
            })

            # Remove automation flags
            cdc_props = driver.execute_script(
                'const j=[];for(const p in window){if(/^[a-z]{3}_[a-zA-Z0-9]{22}_.*/i.test(p)){j.push(p);delete window[p];}}return j;'
            )
            if len(cdc_props) > 0:
                cdc_props_js_array = '[' + ','.join('"' + p + '"' for p in cdc_props) + ']'
                driver.execute_cdp_cmd(
                    'Page.addScriptToEvaluateOnNewDocument',
                    {'source': cdc_props_js_array + '.forEach(k=>delete window[k]);'}
                )
                # logger.debug("Removed automation flags for better stealth")

            # logger.info("Selenium driver initialized successfully with enhanced settings")
            return driver
            
        except Exception as e:
            logger.error(f"Failed to initialize Selenium driver: {str(e)}")
            raise

    def get_selenium_driver_with_logins(self,):
        chrome_options = ChromeOptions()
        # chrome_options.add_argument("--headless")  # Run in headless mode


        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--ignore-certificate-errors")
        chrome_options.add_argument("--allow-running-insecure-content")
        
        # Allow clipboard reading
        chrome_options.add_argument("--allow-clipboard-read")
        chrome_options.add_argument("--allow-clipboard-write")
        
        chrome_options.add_argument("--user-data-dir=/Users/rsahani/Library/Application Support/Google/Chrome/JobScraper")

        # Don't load any extensions or plugins
        chrome_options.add_argument("--disable-extensions")

        # Disable Pop Up Blocking
        chrome_options.add_argument("--disable-popup-blocking")

        # service = Service(ChromeDriverManager().install())
        driver = Chrome(options=chrome_options)

        # This helps avoiding detection
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        cdc_props = driver.execute_script(
            'const j=[];for(const p in window){if(/^[a-z]{3}_[a-zA-Z0-9]{22}_.*/i.test(p)){j.push(p);delete window[p];}}return j;'
        )
        if len(cdc_props) > 0:
            cdc_props_js_array = '[' + ','.join('"' + p + '"' for p in cdc_props) + ']'
            driver.execute_cdp_cmd(
                'Page.addScriptToEvaluateOnNewDocument',
                {'source': cdc_props_js_array + '.forEach(k=>delete window[k]);'}
            )
            # logger.debug("Removed webdriver properties to avoid detection.")
    
        return driver
