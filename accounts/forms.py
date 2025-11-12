from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class RegisterForm(UserCreationForm):
    
    class Meta:
         
        model = User
        fields = ['username','email','password1','password2']

        help_texts = {
            'username': '',
            'email': 'eg. example@gmail.com',
            'passowrd1':None,
        }
       