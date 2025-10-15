from django.db import models

class WaterSource(models.Model):
    WATER_TYPES = [
        ('borehole', 'Borehole'),
        ('well', 'Well'),
        ('river', 'River'),
        ('lake', 'Lake'),
        ('dam', 'Dam'),
    ]

    name = models.CharField(max_length=100)
    water_type = models.CharField(max_length=20, choices=WATER_TYPES)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    nearest_village = models.CharField(max_length=100, blank=True, null=True)
    capacity_liters = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    condition = models.CharField(max_length=100, default='Unknown')
    image = models.URLField(blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.water_type})"
