import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + "/..")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django_Project.settings')
django.setup()

from Admin_Panel.utils_email import send_automated_email

print("=== TESTING AUTOMATED DUAL EMAIL DISPATCH ===")
res = send_automated_email(
    subject="[Test Dispatch] Welcome to CourseHub",
    message="This is an automated briefing confirming user registration & course completion notifications.",
    recipient_list=["pavithrakumaran010622@gmail.com", "pavijeevi56@gmail.com"]
)
print("Dispatch Test Completed. Result:", res)
