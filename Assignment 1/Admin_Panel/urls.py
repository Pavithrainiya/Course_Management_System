from django.urls import path
from Admin_Panel import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.main, name="main"),
    path('home/', views.home, name="Home"),
    path("about/", views.about, name="About"),
    path("update_user/<int:id>/",views.update_user,name="Update_user"),
    path("delete_user/<int:id>/",views.delete_user,name="Delete_user"),
    
    # Authentication paths
    path("login/", auth_views.LoginView.as_view(template_name='login.html'), name="Login"),
    path("logout/", views.logout, name="Logout"),
    path('register/', views.register, name="Register"),
    path("profile/", views.profile, name="Profile"),

    # Course management paths
    path("add_course/", views.add_course, name="Add_Course"),
    path("update_course/<int:id>/", views.update_course, name="Update_Course"),
    path("delete_course/<int:id>/", views.delete_course, name="Delete_Course"),
    
    # Student management paths
    path('manage_students/', views.manage_students, name='Manage_Students'),
    path("add_student/", views.add_student, name="Add_Student"),
    path("update_student/<int:id>/ ", views.update_student, name="Update_Student"),
    path("delete_student/<int:id>/ ", views.delete_student, name="Delete_Student"),
    
    # Enrollment management paths
 path("enroll/", views.enroll, name="Enroll"),
    path("update_enrollment/<int:id>/", views.update_enrollment, name="Update_Enrollment"),
    path("delete_enrollment/<int:id>/", views.delete_enrollment, name="Delete_Enrollment"),
    path("manage_enrollment/", views.manage_enrollment, name="Manage_Enrollment"),
    path('enrollment/', views.enroll_page_view, name='enrollment_page'),
    path('enrollment/<int:course_id>/', views.enroll_course_view, name='enroll_course'),
    # Admin dashboard
    path("dashboard/", views.dashboard, name="Dashboard"),
]
