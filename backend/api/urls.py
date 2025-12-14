# api/urls.py (CORRECTED)

from django.urls import path
from rest_framework.routers import DefaultRouter
# Import the standard JWT login view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# Only import your custom views that are necessary
from .views import RegisterView, SweetViewSet # Removed LoginView

router = DefaultRouter()
router.register(r'sweets', SweetViewSet, basename='sweets')

urlpatterns = [
    # -------------------------------------------------------------------
    # CRITICAL FIX: Use the standard JWT view for login
    # -------------------------------------------------------------------
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Optional but highly recommended: Add the refresh endpoint
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Your custom registration view (assuming this is correct)
    path('auth/register/', RegisterView.as_view(), name='register'),
]

# include the router-generated urls
urlpatterns += router.urls
