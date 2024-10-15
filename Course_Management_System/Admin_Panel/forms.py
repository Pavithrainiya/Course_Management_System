from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django import forms
from .models import Student

class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username','email','password1','password2']


class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ['FirstName', 'LastName', 'Email', 'PhoneNumber', 'Department']
