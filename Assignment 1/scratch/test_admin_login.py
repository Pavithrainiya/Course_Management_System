import urllib.request
import json

url = "http://localhost:8000/api/auth/login/"

req = urllib.request.Request(
    url,
    data=json.dumps({"username": "admin", "password": "Admin_@123"}).encode('utf-8'),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print("Admin Login SUCCESS!")
        print("User:", data['user'])
        print("Token:", data['access'][:30] + "...")
except urllib.error.HTTPError as e:
    print("Admin Login Failed:", e.code, e.read().decode('utf-8'))
