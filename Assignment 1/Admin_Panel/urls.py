from django.urls import path, include
from rest_framework.routers import DefaultRouter
from Admin_Panel import views, views_api
from django.contrib.auth import views as auth_views

router = DefaultRouter()
router.register(r'courses', views_api.CourseViewSet)
router.register(r'modules', views_api.CourseModuleViewSet)
router.register(r'lessons', views_api.LessonViewSet)
router.register(r'students', views_api.StudentViewSet)
router.register(r'enrollments', views_api.EnrollmentViewSet)
router.register(r'course-content', views_api.CourseContentViewSet)

urlpatterns = [
    # REST API Endpoints
    path('api/', include(router.urls)),
    path('api/auth/register/', views_api.RegisterAPIView.as_view(), name='api_register'),
    path('api/auth/login/', views_api.CustomTokenObtainPairView.as_view(), name='api_login'),
    path('api/auth/token/refresh/', views_api.TokenRefreshView.as_view(), name='api_token_refresh'),
    path('api/auth/me/', views_api.CurrentUserAPIView.as_view(), name='api_me'),
    path('api/auth/change-password/', views_api.ChangePasswordAPIView.as_view(), name='api_change_password'),
    path('api/auth/forgot-password/', views_api.ForgotPasswordAPIView.as_view(), name='api_forgot_password'),
    path('api/auth/reset-password/', views_api.ResetPasswordWithCodeAPIView.as_view(), name='api_reset_password'),
    path('api/dashboard/stats/', views_api.DashboardStatsAPIView.as_view(), name='api_stats'),
    
    # AI & Interactive Learning API Endpoints
    path('api/ai/assistant/', views_api.AIAssistantAPIView.as_view(), name='api_ai_assistant'),
    path('api/quizzes/<int:quiz_id>/submit/', views_api.QuizSubmitAPIView.as_view(), name='api_quiz_submit'),
    path('api/lessons/<int:lesson_id>/toggle-complete/', views_api.LessonProgressAPIView.as_view(), name='api_lesson_progress'),
    path('api/certificates/', views_api.CertificateAPIView.as_view(), name='api_certificates_list'),
    path('api/certificates/<int:course_id>/', views_api.CertificateAPIView.as_view(), name='api_certificate'),
    path('api/certificates/generate/', views_api.GenerateCertificateAPIView.as_view(), name='api_certificate_generate'),
    path('api/certificates/<int:cert_id>/approve/', views_api.ApproveCertificateAPIView.as_view(), name='api_certificate_approve'),
    path('api/notifications/send-email/', views_api.SendAdminEmailAPIView.as_view(), name='api_send_email'),

    # Existing Django HTML Template paths
    path('', views.main, name="main"),
    path('home/', views.home, name="Home"),
    path("about/", views.about, name="About"),
    path("update_user/<int:id>/", views.update_user, name="Update_user"),
    path("delete_user/<int:id>/", views.delete_user, name="Delete_user"),
    # Authentication paths
    path("login/", auth_views.LoginView.as_view(template_name='login.html'), name="Login"),
    path("logout/", views.logout, name="Logout"),
    path('register/', views.register, name="Register"),
    path("profile/", views.profile, name="Profile"),
    path("edit_profile/", views.edit_profile, name="edit_profile"),
    path("add_course/", views.add_course, name="Add_Course"),
    path("update_course/<int:id>/", views.update_course, name="Update_Course"),
    path("delete_course/<int:id>/", views.delete_course, name="Delete_Course"),
    path('manage_students/', views.manage_students, name='Manage_Students'),
    path("add_student/", views.add_student, name="Add_Student"),
    path("update_student/<int:id>/", views.update_student, name="Update_Student"),
    path("delete_student/<int:id>/", views.delete_student, name="Delete_Student"),
    path("enroll/", views.enroll, name="Enroll"),
    path("update_enrollment/<int:id>/", views.update_enrollment, name="Update_Enrollment"),
    path("delete_enrollment/<int:id>/", views.delete_enrollment, name="Delete_Enrollment"),
    path("manage_enrollment/", views.manage_enrollment, name="Manage_Enrollment"),
    path('enrollment/', views.enroll_page_view, name='enrollment_page'),
    path('enrollment/<int:course_id>/', views.enroll_course_view, name='enroll_course'),
    path('unenroll/<int:enrollment_id>/', views.unenroll_course_view, name='unenroll_course'),
    path('available-courses/', views.available_courses, name='available_courses'),
    path("dashboard/", views.dashboard, name="Dashboard"),
]
