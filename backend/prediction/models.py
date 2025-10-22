from django.db import models
from django.utils import timezone


class WeatherData(models.Model):
    """Store daily weather data from NASA POWER API"""
    date = models.DateField(unique=True, db_index=True)
    latitude = models.FloatField()
    longitude = models.FloatField()

    # Weather parameters
    precipitation = models.FloatField(help_text="Precipitation (mm/day)")
    temperature = models.FloatField(help_text="Temperature at 2m (°C)")
    temperature_max = models.FloatField(help_text="Maximum Temperature (°C)")
    temperature_min = models.FloatField(help_text="Minimum Temperature (°C)")
    relative_humidity = models.FloatField(help_text="Relative Humidity (%)")
    wind_speed = models.FloatField(help_text="Wind Speed at 2m (m/s)")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        verbose_name_plural = "Weather Data"

    def __str__(self):
        return f"Weather data for {self.date}"


class WeatherPrediction(models.Model):
    """Store weather predictions and alerts"""
    CONDITION_CHOICES = [
        ('normal', 'Normal'),
        ('mild_drought', 'Mild Drought'),
        ('moderate_drought', 'Moderate Drought'),
        ('severe_drought', 'Severe Drought'),
        ('moderate_flood', 'Moderate Flood Risk'),
        ('severe_flood', 'Severe Flood Risk'),
        ('extreme_flood', 'Extreme Flood Risk'),
    ]

    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    date = models.DateField()
    month = models.IntegerField()
    year = models.IntegerField()

    condition = models.CharField(max_length=50, choices=CONDITION_CHOICES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)

    # Metrics
    monthly_precipitation = models.FloatField(help_text="Total monthly precipitation (mm)")
    avg_temperature = models.FloatField(help_text="Average monthly temperature (°C)")
    avg_humidity = models.FloatField(help_text="Average monthly humidity (%)")

    # Prediction details
    confidence_score = models.FloatField(help_text="Prediction confidence (0-100)")
    description = models.TextField()
    recommendations = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['year', 'month']

    def __str__(self):
        return f"{self.get_condition_display()} - {self.year}/{self.month}"


class YearlyForecast(models.Model):
    """Store yearly weather forecasts"""
    year = models.IntegerField(unique=True)

    total_precipitation = models.FloatField()
    avg_temperature = models.FloatField()

    drought_months = models.IntegerField(default=0)
    flood_risk_months = models.IntegerField(default=0)
    normal_months = models.IntegerField(default=0)

    overall_risk_level = models.CharField(max_length=20)
    summary = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year']

    def __str__(self):
        return f"Yearly Forecast - {self.year}"