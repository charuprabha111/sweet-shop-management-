# backend/api/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    # This is a temporary field for password confirmation
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        """
        Check that the two passwords match before user creation.
        """
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data

    def create(self, validated_data):
        # Remove the confirmation field
        validated_data.pop('password2')
        
        # Create the standard user, which automatically hashes the password
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user