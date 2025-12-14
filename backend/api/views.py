from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets
from rest_framework.decorators import action
from .serializers import RegisterSerializer, SweetSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Sweet
from django.db import transaction
from django.db.models import Q 
from rest_framework import filters # <-- NEW: Import for DRF SearchFilter

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({"access": str(refresh.access_token)}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        return Response({"access": str(refresh.access_token), "refresh": str(refresh), "is_admin": user.is_staff}, status=status.HTTP_200_OK)


class SweetViewSet(viewsets.ModelViewSet):
    """
    Basic CRUD for sweets. Implements standard DRF SearchFilter.
    """

    queryset = Sweet.objects.all()
    serializer_class = SweetSerializer
    permission_classes = [permissions.IsAuthenticated]

    # ---------------------------------------------------------------------
    # CRITICAL FIXES FOR SEARCH
    # 1. Use the standard DRF SearchFilter
    filter_backends = [filters.SearchFilter]
    
    # 2. Define the fields to search across (aligns with frontend ?search=)
    search_fields = ['name', 'category', 'price'] 
    # ---------------------------------------------------------------------

    def get_queryset(self):
        qs = Sweet.objects.all()
        
        # DRF's filter_backends will automatically process the 'search' query parameter.
        # We only keep the specific filters below.

        # 2. EXISTING SPECIFIC FILTERS (These run after the main search filter)
        name = self.request.query_params.get('name')
        category = self.request.query_params.get('category')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if name:
            qs = qs.filter(name__icontains=name)
        if category:
            qs = qs.filter(category__iexact=category)
        if min_price:
            try:
                qs = qs.filter(price__gte=float(min_price))
            except (ValueError, TypeError):
                pass
        if max_price:
            try:
                qs = qs.filter(price__lte=float(max_price))
            except (ValueError, TypeError):
                pass
        return qs

    @action(detail=True, methods=['post']) # FINAL FIX: Removed url_path='purchase' for cleaner routing
    def purchase(self, request, pk=None):
        try:
            with transaction.atomic():
                sweet = Sweet.objects.select_for_update().get(pk=pk)
                
                if sweet.quantity <= 0:
                    return Response({"detail": "Out of stock"}, status=status.HTTP_400_BAD_REQUEST)
                
                sweet.quantity -= 1
                sweet.save()
                
                serializer = SweetSerializer(sweet)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Sweet.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='restock', permission_classes=[permissions.IsAdminUser])
    def restock(self, request, pk=None):
        try:
            amount = request.data.get("amount")
            try:
                amount = int(amount)
            except (TypeError, ValueError):
                return Response({"detail": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)
            if amount <= 0:
                return Response({"detail": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                sweet = Sweet.objects.select_for_update().get(pk=pk)
                sweet.quantity += amount
                sweet.save()
                serializer = SweetSerializer(sweet)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Sweet.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)