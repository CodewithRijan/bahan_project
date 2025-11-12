 
from django.urls import path
from . import views

app_name="crowdsource_app"
urlpatterns = [
    path('',views.home, name="home"),
    path('report/',views.report,name="report")
]