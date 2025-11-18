from rest_framework import serializers
from crowdsource_app.models import WaitLogModel

class WaitLogSerializer(serializers.ModelSerializer):
    
    username = serializers.CharField(source='user.username', read_only=True) 
    class Meta:
        model=WaitLogModel 
        fields=[
            'id',
            'user',
            'bus_stop',
            'start_time',
            'end_time',
            'wait_duration',
            'likes',
            'route',
            'username'
        ]
        
        read_only_fields = [
            'id',
            'user',
            'wait_duration',
            'likes',
            'username' 
        ]
        