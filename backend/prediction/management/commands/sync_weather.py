# weather/management/commands/sync_weather.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from weather.services import NASAPowerService, WeatherPredictionService
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Sync weather data from NASA POWER API and generate predictions'

    def add_arguments(self, parser):
        parser.add_argument(
            '--years',
            type=int,
            default=5,
            help='Number of years of historical data to sync (default: 5)'
        )
        parser.add_argument(
            '--forecast-year',
            type=int,
            default=None,
            help='Generate forecast for specific year (default: current year)'
        )
        parser.add_argument(
            '--skip-sync',
            action='store_true',
            help='Skip weather data sync, only generate predictions'
        )

    def handle(self, *args, **options):
        years = options['years']
        forecast_year = options['forecast_year'] or timezone.now().year
        skip_sync = options['skip_sync']

        self.stdout.write(self.style.SUCCESS('Starting weather data sync and prediction...'))

        # Step 1: Sync weather data
        if not skip_sync:
            self.stdout.write('Fetching weather data from NASA POWER API...')
            nasa_service = NASAPowerService()

            try:
                count = nasa_service.sync_historical_data(years=years)
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Successfully synced {count} weather records')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'✗ Error syncing weather data: {e}')
                )
                return
        else:
            self.stdout.write(self.style.WARNING('Skipping weather data sync...'))

        # Step 2: Generate predictions
        self.stdout.write(f'Generating predictions for year {forecast_year}...')
        prediction_service = WeatherPredictionService()

        try:
            # Generate monthly predictions for the year
            predictions_count = 0
            for month in range(1, 13):
                prediction = prediction_service.analyze_monthly_conditions(
                    forecast_year, month
                )
                if prediction:
                    predictions_count += 1
                    self.stdout.write(
                        f'  ✓ {forecast_year}-{month:02d}: {prediction.get_condition_display()}'
                    )

            self.stdout.write(
                self.style.SUCCESS(f'✓ Generated {predictions_count} monthly predictions')
            )

            # Generate yearly forecast
            self.stdout.write(f'Generating yearly forecast for {forecast_year}...')
            forecast = prediction_service.generate_yearly_forecast(forecast_year)

            if forecast:
                self.stdout.write(self.style.SUCCESS('✓ Yearly forecast generated'))
                self.stdout.write(f'\n{self.style.WARNING("FORECAST SUMMARY:")}')
                self.stdout.write(f'Year: {forecast.year}')
                self.stdout.write(f'Risk Level: {forecast.overall_risk_level.upper()}')
                self.stdout.write(f'Drought Months: {forecast.drought_months}')
                self.stdout.write(f'Flood Risk Months: {forecast.flood_risk_months}')
                self.stdout.write(f'Normal Months: {forecast.normal_months}')
                self.stdout.write(f'\n{forecast.summary}')
            else:
                self.stdout.write(
                    self.style.ERROR('✗ Failed to generate yearly forecast')
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'✗ Error generating predictions: {e}')
            )
            return

        self.stdout.write(
            self.style.SUCCESS('\n✓ Weather data sync and prediction completed successfully!')
        )