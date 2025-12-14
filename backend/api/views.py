from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets, filters
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth import authenticate
from django.db import transaction

from .models import Sweet
from .serializers import RegisterSerializer, SweetSerializer


# ============================================================
# ✅ REGISTER
# ============================================================
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {"access": str(refresh.access_token)},
            status=status.HTTP_201_CREATED
        )


# ============================================================
# ✅ LOGIN WITH ADMIN INFO EMBEDDED IN JWT (CRITICAL FIX)
# ============================================================
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 🔥 ADMIN FLAGS INSIDE TOKEN
        token["is_superuser"] = user.is_superuser
        token["is_staff"] = user.is_staff
        token["username"] = user.username

        return token


class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = MyTokenObtainPairSerializer


# ============================================================
# 🍬 SWEETS VIEWSET
# ============================================================
class SweetViewSet(viewsets.ModelViewSet):
    """
    CRUD for sweets + search + purchase + restock
    """

    queryset = Sweet.objects.all()
    serializer_class = SweetSerializer
    permission_classes = [permissions.IsAuthenticated]

    # 🔍 SEARCH SUPPORT
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "category", "price"]

    def get_queryset(self):
        qs = Sweet.objects.all()

        name = self.request.query_params.get("name")
        category = self.request.query_params.get("category")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")

        if name:
            qs = qs.filter(name__icontains=name)
        if category:
            qs = qs.filter(category__iexact=category)
        if min_price:
            try:
                qs = qs.filter(price__gte=float(min_price))
            except ValueError:
                pass
        if max_price:
            try:
                qs = qs.filter(price__lte=float(max_price))
            except ValueError:
                pass

        return qs


    # ========================================================
    # 🛒 PURCHASE (USER)
    # POST /api/sweets/{id}/purchase/
    # ========================================================
    @action(detail=True, methods=["post"])
    def purchase(self, request, pk=None):
        try:
            with transaction.atomic():
                sweet = Sweet.objects.select_for_update().get(pk=pk)

                if sweet.quantity <= 0:
                    return Response(
                        {"detail": "Out of stock"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                sweet.quantity -= 1
                sweet.save()

                return Response(
                    SweetSerializer(sweet).data,
                    status=status.HTTP_200_OK
                )

        except Sweet.DoesNotExist:
            return Response(
                {"detail": "Not found"},
                status=status.HTTP_404_NOT_FOUND
            )


    # ========================================================
    # 📦 RESTOCK (ADMIN ONLY)
    # POST /api/sweets/{id}/restock/
    # ========================================================
    @action(
        detail=True,
        methods=["post"],
        url_path="restock",
        permission_classes=[permissions.IsAdminUser],
    )
    def restock(self, request, pk=None):
        try:
            amount = int(request.data.get("amount", 0))
            if amount <= 0:
                raise ValueError

            with transaction.atomic():
                sweet = Sweet.objects.select_for_update().get(pk=pk)
                sweet.quantity += amount
                sweet.save()

                return Response(
                    SweetSerializer(sweet).data,
                    status=status.HTTP_200_OK
                )

        except (ValueError, TypeError):
            return Response(
                {"detail": "Invalid amount"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Sweet.DoesNotExist:
            return Response(
                {"detail": "Not found"},
                status=status.HTTP_404_NOT_FOUND
            )
