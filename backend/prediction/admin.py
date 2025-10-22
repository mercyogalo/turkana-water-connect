from django.contrib import admin
from .models import WeatherData, WeatherPrediction, YearlyForecast


@admin.register(WeatherData)
class WeatherDataAdmin(admin.ModelAdmin):
    list_display = ['date', 'precipitation', 'temperature', 'relative_humidity', 'created_at']
    list_filter = ['date', 'created_at']
    search_fields = ['date']
    ordering = ['-date']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Location', {
            'fields': ('date', 'latitude', 'longitude')
        }),
        ('Weather Parameters', {
            'fields': ('precipitation', 'temperature', 'temperature_max',
                      'temperature_min', 'relative_humidity', 'wind_speed')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(WeatherPrediction)
class WeatherPredictionAdmin(admin.ModelAdmin):
    list_display = ['date', 'condition', 'severity', 'monthly_precipitation',
                    'confidence_score', 'created_at']
    list_filter = ['condition', 'severity', 'year', 'month']
    search_fields = ['year', 'month', 'description']
    ordering = ['-date']
    readonly_fields = ['created_at']

    fieldsets = (
        ('Time Period', {
            'fields': ('date', 'month', 'year')
        }),
        ('Prediction', {
            'fields': ('condition', 'severity', 'confidence_score')
        }),
        ('Metrics', {
            'fields': ('monthly_precipitation', 'avg_temperature', 'avg_humidity')
        }),
        ('Details', {
            'fields': ('description', 'recommendations')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(YearlyForecast)
class YearlyForecastAdmin(admin.ModelAdmin):
    list_display = ['year', 'overall_risk_level', 'drought_months',
                    'flood_risk_months', 'normal_months', 'created_at']
    list_filter = ['year', 'overall_risk_level']
    search_fields = ['year', 'summary']
    ordering = ['-year']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Year', {
            'fields': ('year',)
        }),
        ('Annual Metrics', {
            'fields': ('total_precipitation', 'avg_temperature')
        }),
        ('Monthly Breakdown', {
            'fields': ('drought_months', 'flood_risk_months', 'normal_months')
        }),
        ('Risk Assessment', {
            'fields': ('overall_risk_level', 'summary')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )