from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework import status
from accounts.models import User
from crowdsource_app.models import WaitLogModel,BusStop
from api.serializer import WaitLogSerializer
from django.http import Http404
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly 

class WaitLogView(APIView):
    
    authentication_classes = [
        SessionAuthentication
    ]
    permission_classes = [IsAuthenticatedOrReadOnly]
     
    def get(self,request,pk):

        waitlog = WaitLogModel.objects.filter(bus_stop=pk).order_by('-end_time')[:5]
        
        serialized_json_data = WaitLogSerializer(waitlog,many=True)

        return Response(serialized_json_data.data) 

    def post(self,request,pk):
        
        deserialized_data = WaitLogSerializer(data=request.data)
        
        if deserialized_data.is_valid():
             
            deserialized_data.save(user=request.user)
             
            return Response({ "data":deserialized_data.data,"message":"WaitLog model saved"},status=status.HTTP_201_CREATED)
        
        return Response(deserialized_data.errors,status=status.HTTP_400_BAD_REQUEST)
            

        
        