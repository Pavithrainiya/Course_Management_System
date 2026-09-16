import urllib.request
import json

url = "http://localhost:8000/api/auth/login/"

def test_login(username_val, password_val, test_name):
    req = urllib.request.Request(
        url,
        data=json.dumps({"username": username_val, "password": password_val}).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"[{test_name}] HTTP {resp.status} - SUCCESS!")
            print("  User ID:", data['user']['id'])
            print("  Username:", data['user']['username'])
            print("  Email:", data['user']['email'])
            print("  Access Token Received:", data['access'][:30] + "...")
    except urllib.error.HTTPError as e:
        print(f"[{test_name}] HTTP {e.code} - FAILED!")
        print("  Error:", e.read().decode('utf-8'))

test_login("sahana", "Sahana_@123", "Lowercase 'sahana'")
test_login("Sahana", "Sahana_@123", "Capital 'Sahana'")
test_login("pavithrakumaran010622@gmail.com", "Sahana_@123", "Email Login")
