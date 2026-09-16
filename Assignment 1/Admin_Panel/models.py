from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid


# User Profile extending User for Role-Based Access Control
class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('INSTRUCTOR', 'Instructor'),
        ('STUDENT', 'Student'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')
    phone = models.CharField(max_length=20, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class Course(models.Model):
    CourseId = models.IntegerField(default=0)
    CourseName = models.CharField(max_length=100)
    Description = models.TextField()
    instructor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='instructor_courses')
    category = models.CharField(max_length=50, default='General')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.CourseName


class CourseModule(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    order = models.IntegerField(default=1)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.course.CourseName} - Module: {self.title}"


class Lesson(models.Model):
    CONTENT_TYPE_CHOICES = (
        ('video', 'Video Lecture'),
        ('pdf', 'Document / PDF'),
        ('text', 'Interactive Article / Notes'),
    )
    module = models.ForeignKey(CourseModule, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=150)
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES, default='text')
    video_url = models.CharField(max_length=500, blank=True, null=True)
    text_content = models.TextField(blank=True, null=True)
    duration_mins = models.IntegerField(default=15)
    order = models.IntegerField(default=1)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.module.title} - Lesson: {self.title}"


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='student_profile')
    FirstName = models.CharField(max_length=50)
    LastName = models.CharField(max_length=50)
    Email = models.EmailField(max_length=50)
    PhoneNumber = models.BigIntegerField(default=0)
    Department = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.FirstName} {self.LastName}"


class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, default='Active')

    def __str__(self):
        return f"{self.student} enrolled in {self.course}"


class LessonProgress(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='student_progress')
    completed = models.BooleanField(default=False)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('student', 'lesson')

    def __str__(self):
        return f"{self.student} - {self.lesson.title}: {'Completed' if self.completed else 'Pending'}"


class CourseContent(models.Model):
    CONTENT_TYPE_CHOICES = (
        ('video', 'Video Lecture'),
        ('document', 'Document / PDF'),
        ('link', 'External Reference Link'),
        ('lecture', 'Lecture Notes'),
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='contents')
    title = models.CharField(max_length=150)
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES, default='lecture')
    content_url = models.CharField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.title} ({self.course.CourseName})"


class Quiz(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=150)
    time_limit_mins = models.IntegerField(default=15)
    passing_score = models.IntegerField(default=70)  # Percentage

    def __str__(self):
        return f"Quiz: {self.title} ({self.course.CourseName})"


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_option = models.CharField(max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')])
    explanation = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.quiz.title} - Q: {self.question_text[:40]}"


class QuizAttempt(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    score = models.IntegerField(default=0)  # Percentage
    passed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.student} - {self.quiz.title} Score: {self.score}%"


class Certificate(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='certificates')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='issued_certificates')
    certificate_code = models.CharField(max_length=50, unique=True, default=uuid.uuid4)
    is_approved = models.BooleanField(default=False)
    status = models.CharField(max_length=40, default='PENDING_ADMIN_APPROVAL')
    issued_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"Certificate for {self.student} - {self.course.CourseName} ({'APPROVED' if self.is_approved else 'PENDING'})"