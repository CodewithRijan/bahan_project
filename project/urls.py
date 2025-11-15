from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('crowdsource_app.urls')),
    path('',include('django.contrib.auth.urls')),
    path('',include('accounts.urls'))
]

# Only when application is in development, serve the media files through this url
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)