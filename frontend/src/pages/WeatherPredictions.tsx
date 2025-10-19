import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Cloud, CloudRain, Droplets, AlertTriangle, TrendingDown, Sun } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeatherPredictions = () => {
  const { t } = useTranslation();

  const currentMonth = new Date().getMonth();
  const monthNames = [
    t('weather.months.jan'), t('weather.months.feb'), t('weather.months.mar'),
    t('weather.months.apr'), t('weather.months.may'), t('weather.months.jun'),
    t('weather.months.jul'), t('weather.months.aug'), t('weather.months.sep'),
    t('weather.months.oct'), t('weather.months.nov'), t('weather.months.dec')
  ];

  const seasonalData = {
    labels: monthNames,
    datasets: [
      {
        label: t('weather.rainfall'),
        data: [15, 20, 45, 85, 120, 80, 60, 55, 40, 55, 70, 25],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: t('weather.temperature'),
        data: [32, 33, 34, 32, 30, 29, 28, 29, 31, 32, 33, 32],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const rainfallData = {
    labels: monthNames,
    datasets: [
      {
        label: t('weather.avgRainfall'),
        data: [15, 20, 45, 85, 120, 80, 60, 55, 40, 55, 70, 25],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: t('weather.rainfallMm')
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: t('weather.tempC')
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t('weather.rainfallMm')
        }
      }
    }
  };

  const getCurrentSeasonInfo = () => {
    if (currentMonth >= 2 && currentMonth <= 4) {
      return {
        season: t('weather.seasons.longRains'),
        icon: <CloudRain className="h-8 w-8 text-blue-500" />,
        condition: t('weather.conditions.wetSeason'),
        risk: t('weather.risks.flooding'),
        color: 'bg-blue-50 border-blue-200'
      };
    } else if (currentMonth >= 9 && currentMonth <= 11) {
      return {
        season: t('weather.seasons.shortRains'),
        icon: <Cloud className="h-8 w-8 text-gray-500" />,
        condition: t('weather.conditions.moderateRain'),
        risk: t('weather.risks.moderate'),
        color: 'bg-gray-50 border-gray-200'
      };
    } else {
      return {
        season: t('weather.seasons.drySeason'),
        icon: <Sun className="h-8 w-8 text-orange-500" />,
        condition: t('weather.conditions.littleRain'),
        risk: t('weather.risks.drought'),
        color: 'bg-orange-50 border-orange-200'
      };
    }
  };

  const seasonInfo = getCurrentSeasonInfo();

  const getRainfallLevel = (mm: number) => {
    if (mm < 30) return { level: t('weather.levels.veryLow'), color: 'destructive' };
    if (mm < 60) return { level: t('weather.levels.low'), color: 'warning' };
    if (mm < 90) return { level: t('weather.levels.moderate'), color: 'default' };
    return { level: t('weather.levels.high'), color: 'success' };
  };

  const currentRainfall = seasonalData.datasets[0].data[currentMonth];
  const rainfallLevel = getRainfallLevel(currentRainfall);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20">
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  {t('weather.predictionsTitle')}
                </h1>
                <p className="text-lg text-gray-600">
                  {t('weather.predictionsSubtitle')}
                </p>
              </div>

              <Alert className="mb-8 border-2 bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <AlertTitle className="text-yellow-900">{t('weather.importantNote')}</AlertTitle>
                <AlertDescription className="text-yellow-800">
                  {t('weather.importantNoteDesc')}
                </AlertDescription>
              </Alert>

              <Card className={`mb-8 border-2 ${seasonInfo.color}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {t('weather.currentMonth')}: {monthNames[currentMonth]}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {t('weather.currentSeasonPrediction')}
                      </CardDescription>
                    </div>
                    {seasonInfo.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t('weather.season')}</p>
                      <p className="text-xl font-semibold">{seasonInfo.season}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t('weather.condition')}</p>
                      <p className="text-xl font-semibold">{seasonInfo.condition}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t('weather.primaryRisk')}</p>
                      <Badge variant={rainfallLevel.color as any} className="text-base px-3 py-1">
                        {seasonInfo.risk}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold">{t('weather.expectedRainfall')}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-blue-600">{currentRainfall}</span>
                      <span className="text-gray-600">mm</span>
                      <Badge variant={rainfallLevel.color as any} className="ml-4">
                        {rainfallLevel.level}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="border-2 border-red-200 bg-red-50">
                  <CardHeader>
                    <div className="flex justify-center mb-2">
                      <TrendingDown className="h-10 w-10 text-red-500" />
                    </div>
                    <CardTitle className="text-center text-red-900">
                      {t('weather.impactCards.waterShortage')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-red-800">
                      {t('weather.impactCards.waterShortageDesc')}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200 bg-orange-50">
                  <CardHeader>
                    <div className="flex justify-center mb-2">
                      <AlertTriangle className="h-10 w-10 text-orange-500" />
                    </div>
                    <CardTitle className="text-center text-orange-900">
                      {t('weather.impactCards.foodInsecurity')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-orange-800">
                      {t('weather.impactCards.foodInsecurityDesc')}
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardHeader>
                    <div className="flex justify-center mb-2">
                      <CloudRain className="h-10 w-10 text-blue-500" />
                    </div>
                    <CardTitle className="text-center text-blue-900">
                      {t('weather.impactCards.floodRisk')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-blue-800">
                      {t('weather.impactCards.floodRiskDesc')}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">{t('weather.annualPatterns')}</CardTitle>
                  <CardDescription>{t('weather.annualPatternsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <Line options={chartOptions} data={seasonalData} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{t('weather.monthlyRainfall')}</CardTitle>
                  <CardDescription>{t('weather.monthlyRainfallDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <Bar options={barChartOptions} data={rainfallData} />
                  </div>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm">{t('weather.legend.veryLow')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-sm">{t('weather.legend.low')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm">{t('weather.legend.moderate')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm">{t('weather.legend.high')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default WeatherPredictions;
