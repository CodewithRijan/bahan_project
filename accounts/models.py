from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    xp = models.IntegerField(default=0,help_text="Current experience level")
    level = models.IntegerField(default=1,help_text="Current user level")
    
    
    def __str__(self):
        # This is what shows up in the Django Admin
        return f"{self.user.username}'s Profile"
