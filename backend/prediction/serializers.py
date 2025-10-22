from rest_framework import serializers
from .models import WeatherData, WeatherPrediction, YearlyForecast


class WeatherDataSerializer(serializers.ModelSerializer):
    """Serializer for daily weather data"""

    class Meta:
        model = WeatherData
        fields = [
            'id', 'date', 'latitude', 'longitude',
            'precipitation', 'temperature', 'temperature_max',
            'temperature_min', 'relative_humidity', 'wind_speed',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class WeatherPredictionSerializer(serializers.ModelSerializer):
    """Serializer for monthly weather predictions"""
    condition_display = serializers.CharField(source='get_condition_display', read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)

    class Meta:
        model = WeatherPrediction
        fields = [
            'id', 'date', 'month', 'year',
            'condition', 'condition_display',
            'severity', 'severity_display',
            'monthly_precipitation', 'avg_temperature', 'avg_humidity',
            'confidence_score', 'description', 'recommendations',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class YearlyForecastSerializer(serializers.ModelSerializer):
    """Serializer for yearly forecasts"""
    monthly_predictions = serializers.SerializerMethodField()

    class Meta:
        model = YearlyForecast
        fields = [
            'id', 'year', 'total_precipitation', 'avg_temperature',
            'drought_months', 'flood_risk_months', 'normal_months',
            'overall_risk_level', 'summary',
            'monthly_predictions', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_monthly_predictions(self, obj):
        """Include monthly predictions in yearly forecast"""
        predictions = WeatherPrediction.objects.filter(year=obj.year)
        return WeatherPredictionSerializer(predictions, many=True).data


class WeatherSyncSerializer(serializers.Serializer):
    """Serializer for weather data sync operations"""
    years = serializers.IntegerField(default=5, min_value=1, max_value=10)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)


class MonthlyAnalysisSerializer(serializers.Serializer):
    """Serializer for monthly analysis requests"""
    year = serializers.IntegerField(min_value=1981, max_value=2050)
    month = serializers.IntegerField(min_value=1, max_value=12)


class CurrentConditionsSerializer(serializers.Serializer):
    """Serializer for current weather conditions summary"""
    current_month = serializers.CharField()
    condition = serializers.CharField()
    severity = serializers.CharField()
    precipitation = serializers.FloatField()
    temperature = serializers.FloatField()
    humidity = serializers.FloatField()
    alert_level = serializers.CharField()
    alert_message = serializers.CharField()
    recommendations = serializers.CharField()