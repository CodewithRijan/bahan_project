from django.shortcuts import render, redirect
from django.urls import reverse
from . import forms
from django.views import View
from django.contrib.auth.models import User

def home(request):
    
    return render(request,'crowdsource_app/home.html')

    
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
            password = form.cleaned_data["password"]
             
            User.objects.create_user(username=username,email=email,password=password)
            
            return redirect(reverse('crowdsource_appp:home'))
        
        context = {'form': form}
        
        return render(request,'crowdsource_app/home.html',context)
    

    
def report(request):
    
    return render(request,'crowdsource_app/report.html')