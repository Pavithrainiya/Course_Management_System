import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django_Project.settings')
django.setup()

from Admin_Panel.models import Course, Student, Enrollment

courses = Course.objects.all()
print(f"Total Courses in DB: {courses.count()}")
for c in courses:
    print(f"ID: {c.id}, Code: {c.CourseId}, Name: {c.CourseName}")

students = Student.objects.all()
print(f"Total Students in DB: {students.count()}")
for s in students:
    print(f"ID: {s.id}, Name: {s.FirstName} {s.LastName}, User: {s.user}")
