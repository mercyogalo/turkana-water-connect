import { Cloud, CloudRain, Sun, Droplets } from 'lucide-react';

const WeatherForecast = () => {
  const seasons = [
    {
      name: 'Dry Season',
      months: 'Jan - Mar',
      icon: Sun,
      condition: 'Low rainfall expected',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      name: 'Long Rains',
      months: 'Apr - Jun',
      icon: CloudRain,
      condition: 'Moderate to high rainfall',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      name: 'Dry Season',
      months: 'Jul - Sep',
      icon: Cloud,
      condition: 'Minimal rainfall',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
    {
      name: 'Short Rains',
      months: 'Oct - Dec',
      icon: Droplets,
      condition: 'Moderate rainfall',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Seasonal Weather Patterns</h2>
          <p className="text-lg text-muted-foreground">
            Understanding Turkana's seasonal rainfall patterns helps communities plan water access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {seasons.map((season, index) => {
            const Icon = season.icon;
            return (
              <div
                key={index}
                className={`${season.bgColor} rounded-lg p-6 border border-border text-center transition-transform hover:scale-105`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${season.color} mb-4`}>
                  <Icon className="h-10 w-10" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{season.name}</h3>
                <p className="text-sm font-medium text-muted-foreground mb-2">{season.months}</p>
                <p className="text-sm text-muted-foreground">{season.condition}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;
