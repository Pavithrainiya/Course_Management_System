from rest_framework import serializers
from django.contrib.auth.models import User
from Admin_Panel.models import (
    UserProfile, Course, CourseModule, Lesson, Student, Enrollment,
    LessonProgress, CourseContent, Quiz, Question, QuizAttempt, Certificate
)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'phone', 'department']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, default='STUDENT')
    phone = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name', 'role', 'phone', 'department']

    def validate_password(self, value):
        import re
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least 1 uppercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least 1 number.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least 1 special character (!@#$%^&*).")
        return value

    def create(self, validated_data):
        role = validated_data.pop('role', 'STUDENT')
        phone = validated_data.pop('phone', '')
        department = validated_data.pop('department', '')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )

        UserProfile.objects.create(user=user, role=role, phone=phone, department=department)

        if role == 'STUDENT':
            Student.objects.create(
                user=user,
                FirstName=user.first_name or user.username,
                LastName=user.last_name or 'Student',
                Email=user.email or f"{user.username}@example.com",
                PhoneNumber=0,
                Department=department or 'General'
            )

        # Automatic email notification upon user registration
        user_email = user.email or (f"{user.username}@example.com" if '@' in user.username else None)
        try:
            from Admin_Panel.utils_email import send_automated_email
            from django.utils import timezone
            now_str = timezone.now().strftime('%Y-%m-%d %H:%M UTC')
            reg_email_body = f"""Greetings {user.first_name or user.username},

Welcome to CourseHub! Your official student account has been successfully created.

--- ACCOUNT REGISTRATION DETAILS ---
ADMIN SENDER : pavijeevi56@gmail.com
USERNAME     : @{user.username}
STUDENT NAME : {(user.first_name or user.username) + ' ' + (user.last_name or '')}
EMAIL        : {user_email or 'Registered'}
REGISTERED   : {now_str}
ROLE         : Student / Learner
------------------------------------

DESCRIPTION & SCOPE OF WORK:
💻 Access 24/7 interactive AI tutor support, auto-graded topic assessments, verified certificates, and real-time learning progress tracking.

Please log in to your CourseHub portal workspace to enroll in active courses and begin your learning journey.

Best regards,
CourseHub Global Administration (pavijeevi56@gmail.com)
"""
            send_automated_email(
                subject="🎉 CourseHub Account Registration Briefing",
                message=reg_email_body,
                recipient_list=[user_email] if user_email else []
            )
        except Exception as reg_e:
            print("Registration email dispatch error:", reg_e)

        return user


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class CourseModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = CourseModule
        fields = ['id', 'course', 'title', 'description', 'order', 'lessons']


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'explanation']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'course', 'title', 'time_limit_mins', 'passing_score', 'questions']


class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.ReadOnlyField(source='quiz.title')

    class Meta:
        model = QuizAttempt
        fields = '__all__'


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = '__all__'


class CertificateSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.__str__')
    course_name = serializers.ReadOnlyField(source='course.CourseName')

    class Meta:
        model = Certificate
        fields = '__all__'


class CourseContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseContent
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.ReadOnlyField(source='instructor.username')
    modules = CourseModuleSerializer(many=True, read_only=True)
    quizzes = QuizSerializer(many=True, read_only=True)
    contents = CourseContentSerializer(many=True, read_only=True)
    enrolled_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'CourseId', 'CourseName', 'Description', 'instructor',
            'instructor_name', 'category', 'created_at', 'modules',
            'quizzes', 'contents', 'enrolled_count'
        ]

    def get_enrolled_count(self, obj):
        return Enrollment.objects.filter(course=obj).count()


class StudentSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Student
        fields = ['id', 'user', 'username', 'FirstName', 'LastName', 'Email', 'PhoneNumber', 'Department']


class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.__str__')
    course_name = serializers.ReadOnlyField(source='course.CourseName')
    course_details = CourseSerializer(source='course', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_name', 'course', 'course_name', 'course_details', 'enrolled_at', 'status']
