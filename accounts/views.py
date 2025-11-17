from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth.models import User
from django.urls import reverse
from . import forms
from django.contrib.auth import login

# Create your views here.
class SignUpView(View):
    
    def get(self,request):
        
        form = forms.RegisterForm()
        context = {'form':form} 

        return render(request,'registration/sign_up.html',context)
        
    def post(self,request):
        
        form = forms.RegisterForm(request.POST)

        if form.is_valid():
            
            username = form.cleaned_data["username"]
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password1"]
             
            new_user = User.objects.create_user(username=username,email=email,password=password)

            login(request,new_user)
            
            return redirect(reverse('crowdsource_app:home'))
        else:
             
            context = {'form': form}
        
            return render(request,'registration/sign_up.html',context)