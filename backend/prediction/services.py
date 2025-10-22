import requests
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.db.models import Avg, Sum
from .models import WeatherData, WeatherPrediction, YearlyForecast
import logging

logger = logging.getLogger(__name__)


class NASAPowerService:
    """Service to fetch and process NASA POWER API data"""

    def __init__(self):
        self.base_url = settings.NASA_POWER_API_URL
        self.latitude = settings.TURKANA_LATITUDE
        self.longitude = settings.TURKANA_LONGITUDE
        self.parameters = settings.NASA_POWER_PARAMETERS

    def fetch_weather_data(self, start_date, end_date):
        """Fetch weather data from NASA POWER API"""
        params = {
            'parameters': ','.join(self.parameters),
            'community': 'AG',  # Agriculture community
            'longitude': self.longitude,
            'latitude': self.latitude,
            'start': start_date.strftime('%Y%m%d'),
            'end': end_date.strftime('%Y%m%d'),
            'format': 'JSON'
        }

        try:
            response = requests.get(self.base_url, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching NASA POWER data: {e}")
            return None

    def store_weather_data(self, data):
        """Store fetched weather data in database"""
        if not data or 'properties' not in data:
            logger.error("Invalid data format from NASA POWER API")
            return 0

        parameters = data['properties']['parameter']
        stored_count = 0

        dates = list(parameters.get('PRECTOTCORR', {}).keys())

        for date_str in dates:
            try:
                date_obj = datetime.strptime(date_str, '%Y%m%d').date()

                weather_data, created = WeatherData.objects.update_or_create(
                    date=date_obj,
                    defaults={
                        'latitude': self.latitude,
                        'longitude': self.longitude,
                        'precipitation': parameters['PRECTOTCORR'].get(date_str, 0),
                        'temperature': parameters['T2M'].get(date_str, 0),
                        'temperature_max': parameters['T2M_MAX'].get(date_str, 0),
                        'temperature_min': parameters['T2M_MIN'].get(date_str, 0),
                        'relative_humidity': parameters['RH2M'].get(date_str, 0),
                        'wind_speed': parameters['WS2M'].get(date_str, 0),
                    }
                )

                if created:
                    stored_count += 1
            except Exception as e:
                logger.error(f"Error storing weather data for {date_str}: {e}")
                continue

        logger.info(f"Stored {stored_count} new weather records")
        return stored_count

    def sync_historical_data(self, years=5):
        """Sync historical weather data for analysis"""
        end_date = datetime.now().date()
        start_date = end_date - relativedelta(years=years)

        logger.info(f"Syncing weather data from {start_date} to {end_date}")

        data = self.fetch_weather_data(start_date, end_date)
        if data:
            return self.store_weather_data(data)
        return 0


class WeatherPredictionService:
    """Service to analyze weather data and make predictions"""

    def __init__(self):
        self.drought_thresholds = settings.DROUGHT_THRESHOLDS
        self.flood_thresholds = settings.FLOOD_THRESHOLDS

    def analyze_monthly_conditions(self, year, month):
        """Analyze weather conditions for a specific month"""
        weather_data = WeatherData.objects.filter(
            date__year=year,
            date__month=month
        )

        if not weather_data.exists():
            return None

        stats = weather_data.aggregate(
            total_precipitation=Sum('precipitation'),
            avg_temperature=Avg('temperature'),
            avg_humidity=Avg('relative_humidity'),
        )

        monthly_precip = stats['total_precipitation']
        avg_temp = stats['avg_temperature']
        avg_humidity = stats['avg_humidity']

        # Determine condition and severity
        condition, severity = self._classify_condition(monthly_precip, avg_temp, avg_humidity)

        # Calculate confidence score based on data completeness
        expected_days = 30
        actual_days = weather_data.count()
        confidence = (actual_days / expected_days) * 100

        description = self._generate_description(
            condition, monthly_precip, avg_temp, avg_humidity
        )
        recommendations = self._generate_recommendations(condition, severity)

        prediction, created = WeatherPrediction.objects.update_or_create(
            year=year,
            month=month,
            defaults={
                'date': datetime(year, month, 1).date(),
                'condition': condition,
                'severity': severity,
                'monthly_precipitation': monthly_precip,
                'avg_temperature': avg_temp,
                'avg_humidity': avg_humidity,
                'confidence_score': confidence,
                'description': description,
                'recommendations': recommendations,
            }
        )

        return prediction

    def _classify_condition(self, precipitation, temperature, humidity):
        """Classify weather condition based on metrics"""
        # Check for drought conditions
        if precipitation < self.drought_thresholds['severe_drought']:
            return 'severe_drought', 'critical'
        elif precipitation < self.drought_thresholds['moderate_drought']:
            return 'moderate_drought', 'high'
        elif precipitation < self.drought_thresholds['mild_drought']:
            return 'mild_drought', 'medium'

        # Check for flood conditions (high precipitation)
        if precipitation > self.flood_thresholds['extreme_flood']:
            return 'extreme_flood', 'critical'
        elif precipitation > self.flood_thresholds['severe_flood']:
            return 'severe_flood', 'high'
        elif precipitation > self.flood_thresholds['moderate_flood']:
            return 'moderate_flood', 'medium'

        # Normal conditions
        return 'normal', 'low'

    def _generate_description(self, condition, precipitation, temperature, humidity):
        """Generate human-readable description"""
        descriptions = {
            'severe_drought': f"Severe drought conditions detected with only {precipitation:.1f}mm of rainfall. "
                            f"Average temperature of {temperature:.1f}°C with {humidity:.1f}% humidity.",
            'moderate_drought': f"Moderate drought conditions with {precipitation:.1f}mm of rainfall. "
                              f"Temperature averaging {temperature:.1f}°C.",
            'mild_drought': f"Mild drought conditions observed. Rainfall at {precipitation:.1f}mm is below normal.",
            'extreme_flood': f"Extreme flood risk! Excessive rainfall of {precipitation:.1f}mm recorded. "
                           f"Immediate precautions recommended.",
            'severe_flood': f"Severe flood risk with {precipitation:.1f}mm of rainfall. "
                          f"Potential for flooding in low-lying areas.",
            'moderate_flood': f"Moderate flood risk detected. Rainfall of {precipitation:.1f}mm above normal levels.",
            'normal': f"Normal weather conditions. Rainfall at {precipitation:.1f}mm with temperature "
                     f"averaging {temperature:.1f}°C.",
        }

        return descriptions.get(condition, "Weather conditions analyzed.")

    def _generate_recommendations(self, condition, severity):
        """Generate actionable recommendations"""
        recommendations = {
            'severe_drought': "• Implement water conservation measures immediately\n"
                            "• Provide emergency water supplies to affected areas\n"
                            "• Support livestock with supplementary feed and water\n"
                            "• Monitor crop health and consider drought-resistant varieties",
            'moderate_drought': "• Begin water conservation efforts\n"
                              "• Monitor water sources and livestock health\n"
                              "• Prepare drought response plans\n"
                              "• Advise farmers on water-efficient practices",
            'mild_drought': "• Monitor rainfall patterns closely\n"
                          "• Prepare for potential water shortages\n"
                          "• Promote water conservation awareness",
            'extreme_flood': "• Issue immediate flood warnings\n"
                           "• Evacuate low-lying areas if necessary\n"
                           "• Activate emergency response teams\n"
                           "• Monitor water levels and weather updates continuously",
            'severe_flood': "• Issue flood alerts to affected communities\n"
                          "• Prepare emergency shelters and supplies\n"
                          "• Clear drainage systems\n"
                          "• Monitor vulnerable areas",
            'moderate_flood': "• Issue flood watch advisories\n"
                            "• Inspect drainage infrastructure\n"
                            "• Prepare emergency response if needed",
            'normal': "• Maintain regular monitoring of weather patterns\n"
                     "• Continue normal agricultural and pastoral activities\n"
                     "• Keep emergency preparedness plans updated",
        }

        return recommendations.get(condition, "Continue monitoring weather conditions.")

    def generate_yearly_forecast(self, year):
        """Generate comprehensive yearly forecast"""
        predictions = WeatherPrediction.objects.filter(year=year)

        if not predictions.exists():
            # Generate predictions for each month
            for month in range(1, 13):
                self.analyze_monthly_conditions(year, month)
            predictions = WeatherPrediction.objects.filter(year=year)

        if not predictions.exists():
            return None

        stats = predictions.aggregate(
            total_precipitation=Sum('monthly_precipitation'),
            avg_temperature=Avg('avg_temperature'),
        )

        # Count different condition types
        drought_months = predictions.filter(
            condition__in=['severe_drought', 'moderate_drought', 'mild_drought']
        ).count()

        flood_months = predictions.filter(
            condition__in=['extreme_flood', 'severe_flood', 'moderate_flood']
        ).count()

        normal_months = predictions.filter(condition='normal').count()

        # Determine overall risk level
        if drought_months >= 6 or flood_months >= 3:
            risk_level = 'critical'
        elif drought_months >= 4 or flood_months >= 2:
            risk_level = 'high'
        elif drought_months >= 2 or flood_months >= 1:
            risk_level = 'medium'
        else:
            risk_level = 'low'

        summary = self._generate_yearly_summary(
            year, drought_months, flood_months, normal_months,
            stats['total_precipitation'], risk_level
        )

        forecast, created = YearlyForecast.objects.update_or_create(
            year=year,
            defaults={
                'total_precipitation': stats['total_precipitation'],
                'avg_temperature': stats['avg_temperature'],
                'drought_months': drought_months,
                'flood_risk_months': flood_months,
                'normal_months': normal_months,
                'overall_risk_level': risk_level,
                'summary': summary,
            }
        )

        return forecast

    def _generate_yearly_summary(self, year, drought_months, flood_months,
                                 normal_months, total_precip, risk_level):
        """Generate yearly summary"""
        summary = f"Weather Forecast Summary for Turkana County - {year}\n\n"
        summary += f"Overall Risk Level: {risk_level.upper()}\n\n"
        summary += f"Annual Precipitation: {total_precip:.1f}mm\n"
        summary += f"Drought-affected months: {drought_months}\n"
        summary += f"Flood risk months: {flood_months}\n"
        summary += f"Normal conditions months: {normal_months}\n\n"

        if drought_months > flood_months:
            summary += "The year is expected to be predominantly dry with significant drought risk. "
            summary += "Water conservation and drought preparedness are critical priorities."
        elif flood_months > drought_months:
            summary += "Elevated flood risk is expected during certain months. "
            summary += "Flood preparedness and infrastructure monitoring are essential."
        else:
            summary += "Mixed weather conditions expected. Maintain balanced preparedness for both "
            summary += "drought and flood scenarios."

        return summary