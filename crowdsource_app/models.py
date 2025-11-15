from django.db import models
from django.contrib.auth.models import User

class BusStop(models.Model):
    
    bus_stop_name = models.TextField(max_length=200,null=False,verbose_name="Bus Stop Name")
    longitude = models.FloatField(verbose_name="Longitude")
    latitude = models.FloatField(verbose_name="Latitude")
    average_rating = models.FloatField(null=True,default=-1)
    bus_photo = models.ImageField(upload_to="images/",null=True)
    
    def __str__(self):
        return self.bus_stop_name

    
class WaitLogModel(models.Model):
    
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    bus_stop = models.ForeignKey(BusStop,on_delete=models.CASCADE,verbose_name="Bus Stop")
    start_time = models.DateTimeField(auto_now_add=True,verbose_name="Start Time")
    end_time = models.DateTimeField(verbose_name="End Time")
    wait_duration = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    route = models.CharField()
    
class Rating(models.Model):
    
    User = models.ForeignKey(User,on_delete=models.CASCADE,verbose_name="Related User")
    bus_stop = models.ForeignKey(BusStop,on_delete=models.CASCADE)
    score = models.IntegerField(default=0)