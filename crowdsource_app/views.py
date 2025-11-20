from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from . import forms
from django.views import View
from django.contrib.auth.models import User
from . import models
import json
from .models import BusStop, Rating, WaitLogModel
from django.http import Http404
from .forms import RatingForm
from django.contrib.auth.decorators import login_required
from accounts.models import UserProfile


def context_helper_function(request,context):
    
    if request.user and request.user.is_authenticated: 
        user_profile = UserProfile.objects.get(user=request.user)
        new_context = {
            'user_profile': user_profile
        }
        context.update(new_context)
        return context
    else:
        return context

def stop(request,stop_id):
  
    try:
        bus_stop = get_object_or_404(BusStop,id=stop_id)
    except Http404:
        return render(request,'crowdsource_app/404.html')
    
    # This is Rating Model form
    ratingForm = RatingForm()

    noOfRatings = Rating.objects.filter(bus_stop=bus_stop).count()
    
    average_rating = round(bus_stop.average_rating,2)
        
    # We only need bus_stop_name, average_rating and bus_photo  
    context = {
        'bus_stop_name': bus_stop.bus_stop_name,
        'average_rating': average_rating,
        'photo_url': bus_stop.bus_photo.url,
        'stop_id': stop_id,
        'form':ratingForm,
        'noOfRatings': noOfRatings
    }
    
    context = context_helper_function(request,context)
    
    return render(request,'crowdsource_app/stop.html',context)

@login_required
def rating_view(request,stop_id):
    
    if request.method == 'POST':
        print("This part is running!")
        form = RatingForm(data=request.POST)
        
        if form.is_valid():
            
            score = form.cleaned_data['score']
            
            try:
                bus_stop = get_object_or_404(BusStop,id=stop_id)
            except Http404:
                return render(request,'crowdsource_app/404.html')
               
            Rating.objects.create(User=request.user,bus_stop=bus_stop,score=score)
             
            return redirect(reverse('crowdsource_app:stop',kwargs={'stop_id':stop_id}))
                
        else:
            return render(request,'crowdsource_app/stop.html',form)

def home(request):
   
    bus_stops = models.BusStop.objects.all()
   
    stops_list = []
    for stop in bus_stops:
        stops_list.append({
            "id":stop.id,
            "name": stop.bus_stop_name,
            "lat":stop.latitude,
            "lon": stop.longitude
        })

    bus_stops_json = json.dumps(stops_list)

    context = {
        "bus_stops_json": bus_stops_json
    }
    
    context = context_helper_function(request,context)
    
    return render(request,'crowdsource_app/home.html',context)

    
def routes(request):
    
    context = context_helper_function(request,{})
    
    return render(request,'crowdsource_app/routes.html',context)

class CommunityView(View):
    
    def get(self,request):
        
        return render(request,"crowdsource_app/community_page.html")


class LikeView(View):
    
    def post(self,request,stop_id):

        if request.user.is_authenticated:

            wait_log_id = request.POST.get('waitlog_id')
            
            wait_log_instance = WaitLogModel.objects.get(id=wait_log_id)
            
            wait_log_instance.increment_likes()
        
            return redirect(reverse('crowdsource_app:stop',kwargs={'stop_id':stop_id}))
        else:
            return redirect('/login/')