import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + "/..")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django_Project.settings')
django.setup()

from django.contrib.auth.models import User
from Admin_Panel.models import UserProfile

admin_user = User.objects.filter(username__iexact='admin').first()
if not admin_user:
    admin_user = User.objects.create_superuser('admin', 'pavijeevi56@gmail.com', 'Admin_@123')
    print("Created superuser 'admin'")
else:
    admin_user.set_password('Admin_@123')
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.is_active = True
    admin_user.email = 'pavijeevi56@gmail.com'
    admin_user.save()
    print("Updated password for 'admin' to 'Admin_@123'")

profile, created = UserProfile.objects.get_or_create(user=admin_user)
profile.role = 'ADMIN'
profile.save()

print("\n=== ADMIN CREDENTIALS CONFIRMED ===")
print("Username : admin (or Admin or pavijeevi56@gmail.com)")
print("Password : Admin_@123")
print("Role     : ADMIN / Administrator Console")
