from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from . import forms
from django.views import View
from django.contrib.auth.models import User
from . import models
import json
from .models import BusStop, Rating
from django.http import Http404
from .forms import RatingForm
from django.contrib.auth.decorators import login_required

def stop(request,stop_id):
  
    try:
        bus_stop = get_object_or_404(BusStop,id=stop_id)
    except Http404:
        return render(request,'crowdsource_app/404.html')
    
    # This is Rating Model form
    ratingForm = RatingForm()
        
    # We only need bus_stop_name, average_rating and bus_photo  
    context = {
        'bus_stop_name': bus_stop.bus_stop_name,
        'average_rating': bus_stop.average_rating,
        'photo_url': bus_stop.bus_photo.url,
        'stop_id': stop_id,
        'form':ratingForm 
    }
    
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
    
    return render(request,'crowdsource_app/home.html',context)

    
def report(request):
    
    return render(request,'crowdsource_app/report.html')

class CommunityView(View):
    
    def get(self,request):
        
        return render(request,"crowdsource_app/community_page.html")