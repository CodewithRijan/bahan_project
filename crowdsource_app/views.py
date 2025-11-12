from django.shortcuts import render, redirect
from django.urls import reverse
from . import forms
from django.views import View
from django.contrib.auth.models import User

def home(request):
    
    return render(request,'crowdsource_app/home.html')

    
def report(request):
    
    return render(request,'crowdsource_app/report.html')