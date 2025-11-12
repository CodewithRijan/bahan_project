
from django.urls import path
from . import views


app_name="accounts"
urlpatterns = [
    path('sign_up/',views.SignUpView.as_view(),name="signup"),
]
