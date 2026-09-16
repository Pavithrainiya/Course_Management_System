import urllib.request
import json

# 1. Test GET course by id (2)
req1 = urllib.request.Request("http://localhost:8000/api/courses/2/")
with urllib.request.urlopen(req1) as r1:
    data1 = json.loads(r1.read().decode('utf-8'))
    print("[Test GET /courses/2/]: HTTP 200 - CourseName:", data1['CourseName'])

# 2. Test GET course by CourseId (102)
req2 = urllib.request.Request("http://localhost:8000/api/courses/102/")
with urllib.request.urlopen(req2) as r2:
    data2 = json.loads(r2.read().decode('utf-8'))
    print("[Test GET /courses/102/]: HTTP 200 - CourseName:", data2['CourseName'])

# 3. Test Enrollment in Course 102 for a user
login_url = "http://localhost:8000/api/auth/login/"
req_login = urllib.request.Request(
    login_url,
    data=json.dumps({"username": "sahana_test_user", "password": "Sahana_@123password"}).encode('utf-8'),
    headers={"Content-Type": "application/json"}
)
token = json.loads(urllib.request.urlopen(req_login).read().decode('utf-8'))['access']

enroll_url = "http://localhost:8000/api/enrollments/"
req_enr = urllib.request.Request(
    enroll_url,
    data=json.dumps({"course": 102}).encode('utf-8'),
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
)
with urllib.request.urlopen(req_enr) as r3:
    enr_data = json.loads(r3.read().decode('utf-8'))
    print("[Test POST /enrollments/ with course: 102]: HTTP 200/201 - Data:", enr_data)
