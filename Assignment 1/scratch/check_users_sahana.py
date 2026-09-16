import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + "/..")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django_Project.settings')
django.setup()

from django.contrib.auth.models import User
from Admin_Panel.models import Student

print("=== ALL DJANGO USER ACCOUNTS ===")
users = User.objects.all()
for u in users:
    print(f"ID: {u.id}, Username: '{u.username}', Email: '{u.email}', IsActive: {u.is_active}, IsStaff: {u.is_staff}, IsSuperuser: {u.is_superuser}")

print("\n=== TESTING SAHANA PASSWORD ===")
sahana = User.objects.filter(username__iexact='sahana').first()
if sahana:
    print(f"Found sahana (exact: {sahana.username})")
    print(f"Check password 'Sahana_@123': {sahana.check_password('Sahana_@123')}")
else:
    print("User 'sahana' NOT FOUND in database!")

print("\n=== ALL STUDENT RECORDS ===")
students = Student.objects.all()
for s in students:
    print(f"ID: {s.id}, FirstName: '{s.FirstName}', LastName: '{s.LastName}', Email: '{s.Email}', User: {s.user}")
