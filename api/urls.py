from django.urls import path
from . import views

app_name='api'
urlpatterns = [
    path('waitlogs/<int:pk>/',views.WaitLogView.as_view(),name="waitlog")
]

