from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Rating,WaitLogModel
from accounts.models import UserProfile
from django.db import models

@receiver(post_save,sender=Rating)
def calculate_average_rating(sender,instance,created,**kwargs):
    
    # Checking to see if a new Rating instance has been created.
    # Prevents re running the same receiver code multiple times
    if created:
        
        average_rating = Rating.objects.filter(bus_stop=instance.bus_stop).aggregate(avg=models.Avg('score'))['avg']
        
        instance.bus_stop.average_rating = average_rating
        instance.bus_stop.save()
        
@receiver(post_save,sender=WaitLogModel)
def increase_xp_upon_creation(sender,instance,created,**kwargs):
    
    if created:
        
        userprofile = UserProfile.objects.get(user=instance.user)
        
        userprofile.xp += 10
        userprofile.save()
        