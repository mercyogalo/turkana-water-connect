# Turkana Weather Prediction System - Setup Instructions

## Overview
This Django backend module uses NASA POWER API to predict weather conditions (drought, floods) for Turkana County, Kenya throughout the year.

## Installation Steps
### 1. Sync Weather Data
```bash
# Sync 5 years of historical data
python manage.py sync_weather --years 5

# Generate forecast for specific year
python manage.py sync_weather --forecast-year 2024

# Skip sync and only generate predictions
python manage.py sync_weather --skip-sync --forecast-year 2024
```

### 2. Run Development Server
```bash
python manage.py runserver
```

## API Endpoints

### Weather Data Endpoints

#### 1. List Weather Data
```
GET /prediction/weather-data/
GET /prediction/weather-data/?year=2024
GET /prediction/weather-data/?month=10
GET /prediction/weather-data/?start_date=2024-01-01&end_date=2024-12-31
```

#### 2. Sync Weather Data
```
POST /prediction/api/weather-data/sync/
Body: {"years": 5}
OR
Body: {"start_date": "2020-01-01", "end_date": "2024-12-31"}
```

### Prediction Endpoints

#### 3. List All Predictions
```
GET /prediction/predictions/
GET /prediction/predictions/?year=2024
GET /prediction/predictions/?condition=severe_drought
GET /prediction/predictions/?severity=critical
```

#### 4. Analyze Specific Month
```
POST /prediction/predictions/analyze_month/
Body: {"year": 2024, "month": 10}
```

#### 5. Get Current Conditions
```
GET /prediction/predictions/current_conditions/
```
Returns current month's weather conditions with alerts.

#### 6. Get Drought Alerts
```
GET /prediction/predictions/drought_alerts/
GET /prediction/predictions/drought_alerts/?year=2024
```

#### 7. Get Flood Alerts
```
GET /prediction/predictions/flood_alerts/
GET /prediction/predictions/flood_alerts/?year=2024
```

### Yearly Forecast Endpoints

#### 8. List Yearly Forecasts
```
GET /prediction/yearly-forecast/
```

#### 9. Generate Yearly Forecast
```
POST /prediction/yearly-forecast/generate_forecast/
Body: {"year": 2024}
```

#### 10. Get Current Year Forecast
```
GET /prediction/yearly-forecast/current_year/
```

#### 11. Compare Multiple Years
```
GET /prediction/yearly-forecast/compare_years/?years=2022,2023,2024
```

## Example API Responses

### Current Conditions Response
```json
{
  "status": "success",
  "data": {
    "current_month": "October 2024",
    "condition": "Moderate Drought",
    "severity": "High",
    "precipitation": 85.5,
    "temperature": 28.3,
    "humidity": 45.2,
    "alert_level": "high",
    "alert_message": "⚠️ HIGH ALERT: Urgent attention needed",
    "recommendations": "• Begin water conservation efforts\n• Monitor water sources..."
  }
}
```

### Yearly Forecast Response
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "year": 2024,
    "total_precipitation": 1250.5,
    "avg_temperature": 27.8,
    "drought_months": 5,
    "flood_risk_months": 2,
    "normal_months": 5,
    "overall_risk_level": "high",
    "summary": "Weather Forecast Summary for Turkana County - 2024...",
    "monthly_predictions": [...]
  }
}
```

## Weather Condition Classifications

### Drought Levels
- **Severe Drought**: < 50mm/month
- **Moderate Drought**: 50-100mm/month
- **Mild Drought**: 100-150mm/month

### Flood Risk Levels
- **Extreme Flood**: > 300mm/month
- **Severe Flood**: 200-300mm/month
- **Moderate Flood**: 150-200mm/month

### Normal Conditions
- Precipitation between 150-200mm/month

## Admin Interface
Access the Django admin at `http://localhost:8000/admin/` to:
- View and manage weather data
- Review predictions and forecasts
- Monitor system status

## Automated Tasks

### Recommended Cron Jobs

#### Daily Weather Sync (Run at 2 AM)
```bash
0 2 * * * cd /path/to/project && /path/to/venv/bin/python manage.py sync_weather --years 1
```

#### Monthly Forecast Generation (Run on 1st of each month)
```bash
0 3 1 * * cd /path/to/project && /path/to/venv/bin/python manage.py sync_weather --skip-sync
```

## Troubleshooting

### NASA POWER API Connection Issues
- Check internet connectivity
- Verify NASA POWER API is accessible
- Check date range (API has historical data from 1981)

### No Predictions Generated
- Ensure weather data is synced first
- Check if data exists for the requested period
- Review logs for errors

### Database Issues
```bash
# Reset database (WARNING: Deletes all data)
python manage.py flush
python manage.py migrate
python manage.py sync_weather --years 5
```

## Testing the API

### Using cURL

#### Sync Weather Data
```bash
curl -X POST http://localhost:8000/predictions/weather-data/sync/ \
  -H "Content-Type: application/json" \
  -d '{"years": 2}'
```

#### Get Current Conditions
```bash
curl http://localhost:8000/predictions/predictions/current_conditions/
```

#### Generate Yearly Forecast
```bash
curl -X POST http://localhost:8000/predictions/yearly-forecast/generate_forecast/ \
  -H "Content-Type: application/json" \
  -d '{"year": 2024}'
```

### Using Python Requests
```python
import requests

# Sync weather data
response = requests.post(
    'http://localhost:8000/predictions/weather-data/sync/',
    json={'years': 2}
)
print(response.json())

# Get current conditions
response = requests.get(
    'http://localhost:8000/predictions/predictions/current_conditions/'
)
print(response.json())
```

## Features

✅ Fetch historical weather data from NASA POWER API
✅ Store daily weather metrics (precipitation, temperature, humidity, wind speed)
✅ Analyze monthly weather patterns
✅ Predict drought conditions (severe, moderate, mild)
✅ Predict flood risks (extreme, severe, moderate)
✅ Generate yearly forecasts
✅ Provide actionable recommendations
✅ Admin interface for data management
✅ Management commands for automation
✅ Comprehensive logging


## Data Sources
- **NASA POWER API**: https://power.larc.nasa.gov/
- **Location**: Turkana County, Kenya (3.1167°N, 35.5989°E)
- **Parameters**: Precipitation, Temperature, Humidity, Wind Speed

## Support
For issues or questions, check the Django logs:
```bash
tail -f /path/to/project/logs/django.log
```