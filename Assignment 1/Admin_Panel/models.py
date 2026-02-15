from django.db import models

# Create your models here.
class Course(models.Model):
    CourseId = models.IntegerField(default="")
    CourseName = models.CharField(max_length=100)
    Description = models.TextField()
  
    def __str__(self):
        return self.CourseName

class Student(models.Model):
    FirstName = models.CharField(max_length=50)
    LastName = models.CharField(max_length=50)
    Email = models.EmailField(max_length=50)
    PhoneNumber = models.IntegerField()
    Department = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.FirstName} {self.LastName}"

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.student} enrolled in {self.course}"