import urllib.request
import json

# 1. Login sahana_test_user
login_url = "http://localhost:8000/api/auth/login/"
req = urllib.request.Request(
    login_url,
    data=json.dumps({"username": "sahana_test_user", "password": "Sahana_@123password"}).encode('utf-8'),
    headers={"Content-Type": "application/json"}
)
token = None
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    token = data['access']
    print("Login Success for sahana_test_user!")

# 2. Enroll in Course #1
enroll_url = "http://localhost:8000/api/enrollments/"
req_enroll = urllib.request.Request(
    enroll_url,
    data=json.dumps({"course": 1}).encode('utf-8'),
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
)

try:
    with urllib.request.urlopen(req_enroll) as resp:
        enroll_data = json.loads(resp.read().decode('utf-8'))
        print("Enrollment SUCCESS! Email Sent Status:", enroll_data.get('email_sent'))
        print("Student Email in Enrollment:", enroll_data.get('student_email'))
except urllib.error.HTTPError as e:
    print("Enrollment Error:", e.code, e.read().decode('utf-8'))
