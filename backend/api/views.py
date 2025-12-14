from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets
from rest_framework.decorators import action
from .serializers import RegisterSerializer, SweetSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Sweet
from django.db import transaction
from django.db.models import Q # <--- NEW IMPORT: Needed for OR logic in search

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        # Note: Depending on your setup, you might want to return the token here too
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
    Basic CRUD for sweets. Requires authentication for all actions.
    Supports broad search via 'q' parameter, and existing specific filters.
    """

    queryset = Sweet.objects.all()
    serializer_class = SweetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Sweet.objects.all()
        
        # 1. BROAD SEARCH via 'q' parameter (for frontend Search.jsx)
        query = self.request.query_params.get('q')
        
        if query:
            # Try to convert query to a number for price search
            try:
                price_query = float(query)
                is_numeric = True
            except (ValueError, TypeError):
                is_numeric = False
            
            # Filter by name (contains) OR category (contains)
            q_objects = Q(name__icontains=query) | Q(category__icontains=query)
            
            # If the query is a number, include price lookup
            if is_numeric:
                q_objects |= Q(price=price_query)

            qs = qs.filter(q_objects)
            
            # If a broad search is performed, we return the results immediately
            # to prevent specific filters from being applied on top of the search result.
            return qs 

        # 2. EXISTING SPECIFIC FILTERS (Only run if NO broad 'q' search is performed)
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

    @action(detail=True, methods=['post'], url_path='purchase')
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