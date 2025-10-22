from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from datetime import datetime
from .models import WeatherData, WeatherPrediction, YearlyForecast
from .serializers import (
    WeatherDataSerializer, WeatherPredictionSerializer,
    YearlyForecastSerializer, WeatherSyncSerializer,
    MonthlyAnalysisSerializer, CurrentConditionsSerializer
)
from .services import NASAPowerService, WeatherPredictionService
import logging

logger = logging.getLogger(__name__)


class WeatherDataViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing weather data.
    Provides list and detail views for daily weather records.
    """
    queryset = WeatherData.objects.all()
    serializer_class = WeatherDataSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Filter weather data by date range"""
        queryset = WeatherData.objects.all()

        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        year = self.request.query_params.get('year', None)
        month = self.request.query_params.get('month', None)

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        if year:
            queryset = queryset.filter(date__year=year)
        if month:
            queryset = queryset.filter(date__month=month)

        return queryset

    @action(detail=False, methods=['post'])
    def sync(self, request):
        """
        Sync weather data from NASA POWER API
        POST /api/weather-data/sync/
        Body: {"years": 5} or {"start_date": "2020-01-01", "end_date": "2024-12-31"}
        """
        serializer = WeatherSyncSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            service = NASAPowerService()

            if 'start_date' in serializer.validated_data and 'end_date' in serializer.validated_data:
                data = service.fetch_weather_data(
                    serializer.validated_data['start_date'],
                    serializer.validated_data['end_date']
                )
                count = service.store_weather_data(data) if data else 0
            else:
                count = service.sync_historical_data(
                    years=serializer.validated_data.get('years', 5)
                )

            return Response({
                'status': 'success',
                'message': f'Successfully synced {count} weather records',
                'records_added': count
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error syncing weather data: {e}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WeatherPredictionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for weather predictions.
    Provides monthly weather condition predictions and analysis.
    """
    queryset = WeatherPrediction.objects.all()
    serializer_class = WeatherPredictionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Filter predictions by year, month, condition, severity"""
        queryset = WeatherPrediction.objects.all()

        year = self.request.query_params.get('year', None)
        month = self.request.query_params.get('month', None)
        condition = self.request.query_params.get('condition', None)
        severity = self.request.query_params.get('severity', None)

        if year:
            queryset = queryset.filter(year=year)
        if month:
            queryset = queryset.filter(month=month)
        if condition:
            queryset = queryset.filter(condition=condition)
        if severity:
            queryset = queryset.filter(severity=severity)

        return queryset

    @action(detail=False, methods=['post'])
    def analyze_month(self, request):
        """
        Analyze weather conditions for a specific month
        POST /api/predictions/analyze_month/
        Body: {"year": 2024, "month": 10}
        """
        serializer = MonthlyAnalysisSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            service = WeatherPredictionService()
            prediction = service.analyze_monthly_conditions(
                year=serializer.validated_data['year'],
                month=serializer.validated_data['month']
            )

            if prediction:
                return Response({
                    'status': 'success',
                    'data': WeatherPredictionSerializer(prediction).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'status': 'error',
                    'message': 'No weather data available for the specified month'
                }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            logger.error(f"Error analyzing month: {e}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def current_conditions(self, request):
        """
        Get current month's weather conditions and alerts
        GET /api/predictions/current_conditions/
        """
        try:
            now = timezone.now()
            current_year = now.year
            current_month = now.month

            # Try to get or create prediction for current month
            service = WeatherPredictionService()
            prediction = WeatherPrediction.objects.filter(
                year=current_year,
                month=current_month
            ).first()

            if not prediction:
                prediction = service.analyze_monthly_conditions(current_year, current_month)

            if not prediction:
                return Response({
                    'status': 'error',
                    'message': 'No data available for current month. Please sync weather data first.'
                }, status=status.HTTP_404_NOT_FOUND)

            # Generate alert message
            alert_messages = {
                'critical': '🚨 CRITICAL ALERT: Immediate action required!',
                'high': '⚠️ HIGH ALERT: Urgent attention needed',
                'medium': '⚡ MODERATE ALERT: Monitor situation closely',
                'low': '✓ LOW RISK: Normal monitoring sufficient'
            }

            response_data = {
                'current_month': now.strftime('%B %Y'),
                'condition': prediction.get_condition_display(),
                'severity': prediction.get_severity_display(),
                'precipitation': prediction.monthly_precipitation,
                'temperature': prediction.avg_temperature,
                'humidity': prediction.avg_humidity,
                'alert_level': prediction.severity,
                'alert_message': alert_messages.get(prediction.severity, ''),
                'recommendations': prediction.recommendations
            }

            serializer = CurrentConditionsSerializer(response_data)
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error getting current conditions: {e}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def drought_alerts(self, request):
        """
        Get all drought condition predictions
        GET /api/predictions/drought_alerts/
        """
        year = request.query_params.get('year', timezone.now().year)

        drought_predictions = WeatherPrediction.objects.filter(
            year=year,
            condition__in=['severe_drought', 'moderate_drought', 'mild_drought']
        )

        serializer = self.get_serializer(drought_predictions, many=True)
        return Response({
            'status': 'success',
            'count': drought_predictions.count(),
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def flood_alerts(self, request):
        """
        Get all flood risk predictions
        GET /api/predictions/flood_alerts/
        """
        year = request.query_params.get('year', timezone.now().year)

        flood_predictions = WeatherPrediction.objects.filter(
            year=year,
            condition__in=['extreme_flood', 'severe_flood', 'moderate_flood']
        )

        serializer = self.get_serializer(flood_predictions, many=True)
        return Response({
            'status': 'success',
            'count': flood_predictions.count(),
            'data': serializer.data
        }, status=status.HTTP_200_OK)


class YearlyForecastViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for yearly weather forecasts.
    Provides comprehensive annual weather predictions for Turkana.
    """
    queryset = YearlyForecast.objects.all()
    serializer_class = YearlyForecastSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def generate_forecast(self, request):
        """
        Generate yearly forecast for a specific year
        POST /api/yearly-forecast/generate_forecast/
        Body: {"year": 2024}
        """
        year = request.data.get('year', timezone.now().year)

        try:
            service = WeatherPredictionService()
            forecast = service.generate_yearly_forecast(year)

            if forecast:
                return Response({
                    'status': 'success',
                    'data': YearlyForecastSerializer(forecast).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'status': 'error',
                    'message': f'Unable to generate forecast for {year}. Please ensure weather data is synced.'
                }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            logger.error(f"Error generating yearly forecast: {e}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def current_year(self, request):
        """
        Get forecast for current year
        GET /api/yearly-forecast/current_year/
        """
        current_year = timezone.now().year

        forecast = YearlyForecast.objects.filter(year=current_year).first()

        if not forecast:
            # Try to generate it
            service = WeatherPredictionService()
            forecast = service.generate_yearly_forecast(current_year)

        if forecast:
            serializer = self.get_serializer(forecast)
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'status': 'error',
                'message': 'No forecast available for current year. Please sync weather data and generate forecast.'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def compare_years(self, request):
        """
        Compare forecasts across multiple years
        GET /api/yearly-forecast/compare_years/?years=2022,2023,2024
        """
        years_param = request.query_params.get('years', '')

        if not years_param:
            return Response({
                'status': 'error',
                'message': 'Please provide years parameter (e.g., ?years=2022,2023,2024)'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            years = [int(y.strip()) for y in years_param.split(',')]
            forecasts = YearlyForecast.objects.filter(year__in=years).order_by('year')

            serializer = self.get_serializer(forecasts, many=True)

            # Calculate comparison metrics
            comparison = {
                'years_compared': len(forecasts),
                'forecasts': serializer.data,
                'trends': self._calculate_trends(forecasts)
            }

            return Response({
                'status': 'success',
                'data': comparison
            }, status=status.HTTP_200_OK)

        except ValueError:
            return Response({
                'status': 'error',
                'message': 'Invalid year format. Please provide comma-separated years.'
            }, status=status.HTTP_400_BAD_REQUEST)

    def _calculate_trends(self, forecasts):
        """Calculate trends across years"""
        if len(forecasts) < 2:
            return {}

        first = forecasts.first()
        last = forecasts.last()

        precip_change = ((last.total_precipitation - first.total_precipitation) /
                        first.total_precipitation * 100)
        temp_change = last.avg_temperature - first.avg_temperature

        drought_trend = 'increasing' if last.drought_months > first.drought_months else 'decreasing'
        flood_trend = 'increasing' if last.flood_risk_months > first.flood_risk_months else 'decreasing'

        return {
            'precipitation_change_percent': round(precip_change, 2),
            'temperature_change_celsius': round(temp_change, 2),
            'drought_trend': drought_trend,
            'flood_trend': flood_trend
        }