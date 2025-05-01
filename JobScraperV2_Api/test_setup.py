import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_registration():
    url = f'{BASE_URL}/auth/register/'
    data = {
        "email": "test@example.com",
        "password": "TestPass123!",
        "password2": "TestPass123!",
        "first_name": "Test",
        "last_name": "User"
    }
    
    response = requests.post(url, json=data)
    print("\nTesting Registration:")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json() if response.status_code == 201 else None

def test_login():
    url = f'{BASE_URL}/auth/login/'
    data = {
        "email": "test@example.com",
        "password": "TestPass123!"
    }
    
    response = requests.post(url, json=data)
    print("\nTesting Login:")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json().get('access') if response.status_code == 200 else None

def test_protected_endpoint(token):
    url = f'{BASE_URL}/profile/completion/'
    headers = {'Authorization': f'Bearer {token}'}
    
    response = requests.get(url, headers=headers)
    print("\nTesting Protected Endpoint:")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def main():
    print("Starting API Tests...")
    registration_result = test_registration()
    if registration_result:
        print("\nRegistration successful!")
        token = test_login()
        if token:
            print("\nLogin successful!")
            test_protected_endpoint(token)
        else:
            print("\nLogin failed!")
    else:
        print("\nRegistration failed!")

if __name__ == '__main__':
    main()