from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as log
from .models import Course, Student, Enrollment
from .forms import CreateUserForm,StudentForm



# Register View (Create user)
def register(request):
    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            User.is_staff=True
            messages.success(request, 'Account created successfully! You can now log in.')
            return redirect('Login')
        else:
            messages.error(request, 'Registration failed. Please check the form for errors.')
    else:
        form = CreateUserForm()
    return render(request, "register.html", {'form': form})

# Profile View (Show student details and enrolled courses)
@login_required
def profile(request):
    enrollments = Enrollment.objects.all()  # Admin can see all enrollments
    user_name = request.user.username
    user_email = request.user.email
    try:
            student = Student.objects.get(Email=user_email)
    except Student.DoesNotExist:
            student = None

    return render(request, 'profile.html',{'student': student,'uname':user_name,'umail':user_email,'enrollments': enrollments})

# Logout View
def logout(request):
    log(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('main')

# Add Course View (For admin to add new courses)
@login_required
def add_course(request):
    if request.method == 'POST':
        code = request.POST['code']
        name = request.POST['name']
        description = request.POST['description']
        
        course = Course( CourseId=code,CourseName=name,Description=description)
        course.save()
        messages.success(request, 'Course added successfully.')
        return redirect('Home')
    return render(request, 'add_course.html')

# Update Course View
@login_required
def update_course(request, id):
    course = get_object_or_404(Course, id=id)
    
    if request.method == 'POST':
        course.CourseId = request.POST['code']
        course.CourseName = request.POST['name']
        course.Description = request.POST['description']
        course.save()
        
        messages.success(request, 'Course updated successfully.')
        return redirect('Home')
    
    return render(request, 'edit_course.html', {'course': course})

# Delete Course View
@login_required
def delete_course(request, id):
    course = get_object_or_404(Course, id=id)
    course.delete()
    messages.success(request, 'Course deleted successfully.')
    return redirect('Home')

# Home View (List all available courses)
@login_required
def home(request):
    courses = Course.objects.all()
    return render(request, 'home.html', {'courses': courses})

# Main View (Landing page)
def main(request):
    return render(request, 'main.html')

# About View (Info about the system)
def about(request):
    return render(request, 'about.html')

# Dashboard View (For admin to manage users and courses)
@login_required
def dashboard(request):
    users = User.objects.all()
    courses = Course.objects.all()
    return render(request, 'dashboard.html', {'users': users, 'courses': courses})

# Update User View (For admin to update user information)
@login_required
def update_user(request, id):
    user = get_object_or_404(User, id=id)
    
    if request.method == 'POST':
        user.username = request.POST["username"]
        user.email = request.POST["email"]
        user.save()

        messages.success(request, 'User updated successfully.')
        return redirect('Dashboard')
    
    return render(request, 'edit_user.html', {'data': user})

# Delete User View (For admin to remove users)
@login_required
def delete_user(request, id):
    user = get_object_or_404(User, id=id)
    user.delete()
    messages.success(request, 'User deleted successfully.')
    return redirect('Dashboard')

# Add Student View (For admin to add students)


@login_required
def manage_students(request):
    students = Student.objects.all()  # Retrieve all Student objects
    return render(request, 'manage_students.html', {'students': students})  # Pass the student list to the template

@login_required
def add_student(request):
    if request.method == 'POST':
        form = StudentForm(request.POST)
        if form.is_valid():
            form.save()  # Save the student instance
            messages.success(request, 'Student added successfully.')
            return redirect('Manage_Students')  # Redirect to the home page or wherever necessary
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = StudentForm()  # Create an empty form instance

    return render(request, 'add_student.html', {'form': form})


# Update Student View (For admin to update student details)
@login_required
def update_student(request, id):
    student = get_object_or_404(Student, id=id)
    
    if request.method == 'POST':
        form = StudentForm(request.POST, instance=student)  # Bind the form with the student instance
        if form.is_valid():  # Validate the form
            form.save()  # Save the updated student information
            messages.success(request, 'Student updated successfully.')
            return redirect('Home')
    else:
        form = StudentForm(instance=student)  # Create a form instance with the current student data
    
    return render(request, 'edit_student.html', {'form': form})  # Pass the form to the template

# Delete Student View (For admin to remove students)
@login_required
def delete_student(request, id):
    student = get_object_or_404(Student, id=id)
    student.delete()
    messages.success(request, 'Student deleted successfully.')
    return redirect('Home')

# Enrollment Views (For managing course enrollments)
@login_required
def manage_enrollment(request):
    enrollments = Enrollment.objects.all()  # Admin can see all enrollments
    return render(request, 'manage_enrollment.html', {'enrollments': enrollments})


@login_required
def enroll(request):
    courses = Course.objects.all()
    students = Student.objects.all()

    if request.method == 'POST':
        course_id = request.POST.get('course_id')
        student_id = request.POST.get('student_id')

        if not course_id or not student_id:
            messages.error(request, 'Both student and course must be selected.')
            return render(request, 'enroll.html', {'courses': courses, 'students': students})

        # Fetch the Course and Student objects
        try:
            course = Course.objects.get(id=course_id)
            student = Student.objects.get(id=student_id)

            # Create the Enrollment instance
            enrollment = Enrollment(course=course, student=student)
            enrollment.save()

            messages.success(request, 'Enrollment successful.')
            return redirect('Manage_Enrollment')
        
        except Course.DoesNotExist:
            messages.error(request, 'Course not found.')
        except Student.DoesNotExist:
            messages.error(request, 'Student not found.')

    return render(request, 'enroll.html', {'courses': courses, 'students': students})

@login_required
def update_enrollment(request,id):
    enrollment = get_object_or_404(Enrollment, id=id)
    students = Student.objects.all()
    courses = Course.objects.all()

    if request.method == 'POST':
        student_id = request.POST.get('student_id')
        course_id = request.POST.get('course_id')

        # Update the enrollment
        enrollment.student = get_object_or_404(Student, id=student_id)
        enrollment.course = get_object_or_404(Course, id=course_id)
        enrollment.save()

        messages.success(request, 'Enrollment updated successfully!')
        return redirect('Manage_Enrollment')

    return render(request, 'edit_enrollment.html', {'enrollment': enrollment, 'students': students, 'courses': courses})

@login_required
def delete_enrollment(request, id):
    enrollment = get_object_or_404(Enrollment, id=id)
    enrollment.delete()
    messages.success(request, 'Enrollment deleted successfully.')
    return redirect('Manage_Enrollment')

@login_required
def enroll_course_view(request, course_id):
    if request.method == 'POST':
        course = get_object_or_404(Course, id=course_id)
        # Check if the user is already enrolled
        if Enrollment.objects.filter(student=request.user, course=course).exists():
            messages.warning(request, "You are already enrolled in this course.")
        else:
            # Create a new enrollment
            Enrollment.objects.create(student=request.user, course=course)
            messages.success(request, "You have successfully enrolled in the course.")

        return redirect('enrollment_page') 
    

@login_required
def enroll_page_view(request):
    courses = Course.objects.all()
    return render(request, 'enroll_course.html', {'courses': courses})