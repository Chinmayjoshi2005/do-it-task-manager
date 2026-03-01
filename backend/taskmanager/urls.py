from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

def api_health_check(request):
    return JsonResponse({'status': 'online', 'message': 'DO IT Task Manager API is running successfully.'})

urlpatterns = [
    path('', api_health_check),
    path('admin/', admin.site.urls),
    path('api/', include('apps.authentication.urls')),
    path('api/', include('apps.tasks.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
