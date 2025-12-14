# Django Project -> sweetshop/urls.py (CORRECTED)

from django.contrib import admin
from django.urls import path, include
# You do NOT need to import rest_framework_simplejwt views here anymore
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView, 
#     TokenRefreshView
# ) 

urlpatterns = [
    # Django Admin URL
    path('admin/', admin.site.urls),
    
    # URL for your entire API application (THIS IS THE CORRECT STRUCTURE)
    # ALL authentication (login, register) and CRUD (sweets) paths MUST be inside 'api/urls.py'
    path('api/', include('api.urls')), 
    
    # --- The duplicate AUTHENTICATION ENDPOINTS have been REMOVED ---
    # path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]