import urllib.request
import json

url = "http://localhost:8000/api/auth/register/"

user_data = {
    "username": "sahana_test_user",
    "password": "Sahana_@123password",
    "email": "pavithrakumaran010622@gmail.com",
    "first_name": "Sahana",
    "last_name": "Test",
    "role": "STUDENT",
    "department": "Computer Science"
}

req = urllib.request.Request(
    url,
    data=json.dumps(user_data).encode('utf-8'),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print("Registration SUCCESS! Response:", data)
except urllib.error.HTTPError as e:
    print("Registration HTTP Status:", e.code)
    print("Response:", e.read().decode('utf-8'))
