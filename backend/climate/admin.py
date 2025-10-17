from django.contrib import admin
from .models import ContactMessage, WaterSource

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']

@admin.register(WaterSource)
class WaterSourceAdmin(admin.ModelAdmin):
    list_display = ['name', 'water_type', 'nearest_village', 'condition']
    list_filter = ['water_type', 'condition']
    search_fields = ['name', 'nearest_village']
