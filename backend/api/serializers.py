from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

# NEW IMPORTS REQUIRED FOR JWT CUSTOMIZATION
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from datetime import timedelta 

from .models import Sweet

# ------------------------------------------------------------------
# NEW CLASS: CUSTOM JWT TOKEN SERIALIZER
# This is the critical fix. It tells the token to include the user's
# admin status (is_staff and is_superuser).
# ------------------------------------------------------------------
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Calls the parent to generate the base token
        token = super().get_token(user)

        # Add custom claims: these are the fields your React frontend needs
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser

        return token

# ------------------------------------------------------------------
# EXISTING: RegisterSerializer 
# ------------------------------------------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    password = serializers.CharField(write_only=True, min_length=6, validators=[validate_password])

    class Meta:
        model = User
        fields = ("username", "email", "password", "password2") 

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2') 
        
        user = User(username=validated_data['username'], email=validated_data.get('email', ''))
        user.set_password(validated_data['password'])
        user.save()
        return user

# ------------------------------------------------------------------
# EXISTING: SweetSerializer
# ------------------------------------------------------------------
class SweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sweet
        fields = ("id", "name", "category", "price", "quantity")