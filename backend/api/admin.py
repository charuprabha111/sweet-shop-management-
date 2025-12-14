# sweet-shop-management-/backend/api/admin.py

from django.contrib import admin
from .models import Sweet  # 1. IMPORT YOUR SWEET MODEL

# 2. REGISTER THE MODEL
admin.site.register(Sweet)