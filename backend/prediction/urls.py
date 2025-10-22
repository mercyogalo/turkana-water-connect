
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WeatherDataViewSet, WeatherPredictionViewSet, YearlyForecastViewSet

router = DefaultRouter()
router.register(r'weather-data', WeatherDataViewSet, basename='weather-data')
router.register(r'predictions', WeatherPredictionViewSet, basename='predictions')
router.register(r'yearly-forecast', YearlyForecastViewSet, basename='yearly-forecast')

urlpatterns = [
    path('', include(router.urls)),
]