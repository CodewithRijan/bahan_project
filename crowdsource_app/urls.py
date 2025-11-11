 
from django.urls import path
from . import views

app_name="crowdsource_app"
urlpatterns = [
    path('',views.home, name="home"),
    path('sign_up/',views.SignUpView.as_view(),name="signup"),
    path('report/',views.report,name="report")
]