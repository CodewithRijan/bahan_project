 
from django.urls import path
from . import views

app_name="crowdsource_app"
urlpatterns = [
    path('',views.home, name="home"),
    path('routes/',views.routes,name="routes"),
    path('stop/<int:stop_id>',views.stop,name="stop"),
    path('community/',views.CommunityView.as_view(),name="community"),
    path('add_rating/<int:stop_id>',views.rating_view,name="add_rating"),
    path('waitlogs/<int:stop_id>/likes',views.LikeView.as_view(),name="waitlog_likes"),
]