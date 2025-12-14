from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Sweet

# ------------------------------------------------------------------
# CORRECTED RegisterSerializer (Adds password2 confirmation logic)
# ------------------------------------------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    # Add password2 field for confirmation
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    password = serializers.CharField(write_only=True, min_length=6, validators=[validate_password])

    class Meta:
        model = User
        # Include password2 in the fields
        fields = ("username", "email", "password", "password2") 

    def validate(self, data):
        """
        Validation method to check that the two passwords match.
        """
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data

    def create(self, validated_data):
        # Remove the password2 confirmation field before saving
        validated_data.pop('password2') 
        
        user = User(username=validated_data['username'], email=validated_data.get('email', ''))
        user.set_password(validated_data['password'])
        user.save()
        return user

class SweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sweet
        fields = ("id", "name", "category", "price", "quantity")