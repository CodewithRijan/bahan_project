from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django import forms

class RegisterForm(UserCreationForm):
    
    email = forms.EmailField(required=True,help_text="e.g. example@gmail.com")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self["password1"].help_text = "Password must be at least 8 characters"
        
    class Meta:
         
        model = User
        fields = ['username','email','password1','password2']

        help_texts = {
            'username': '',
            'email': 'eg. example@gmail.com',
        }
       