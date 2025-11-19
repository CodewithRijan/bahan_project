from django.db import models
from django.contrib.auth.models import User
from accounts.models import UserProfile

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
    start_time = models.DateTimeField(verbose_name="Start Time")
    end_time = models.DateTimeField(verbose_name="End Time")
    wait_duration = models.IntegerField(default=0)
    likes = models.IntegerField(default=0,editable=False)
    route = models.CharField()
    
    def save(self, *args, **kwargs):
        if self.start_time and self.end_time:
            self.wait_duration = (self.end_time - self.start_time).total_seconds()
        
        super().save(*args, **kwargs) # Call the "real" save method
    
    def increment_likes(self):
        
        self.likes += 1
        self.save() 
        
        userprofile_instance = UserProfile.objects.get(user=self.user)
        userprofile_instance.xp += 10
        userprofile_instance.save()
        
        
    def __str__(self):
        return f"{self.user.username} waited at {self.bus_stop.bus_stop_name} for {self.wait_duration}s"
    
class Rating(models.Model):
    
    User = models.ForeignKey(User,on_delete=models.CASCADE,verbose_name="Related User")
    bus_stop = models.ForeignKey(BusStop,on_delete=models.CASCADE)
    score = models.IntegerField(default=0)