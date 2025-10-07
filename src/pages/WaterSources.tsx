import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { waterSources, WaterSource } from '@/data/waterSources';
import { Download, MapPin, Droplet, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WaterSources = () => {
  const [selectedSource, setSelectedSource] = useState<WaterSource | null>(null);

  const downloadJSON = () => {
    const dataStr = JSON.stringify(waterSources, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'water-sources.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const downloadCSV = () => {
    const headers = ['ID', 'Name', 'Location', 'Latitude', 'Longitude', 'Type', 'Status'];
    const csvRows = [
      headers.join(','),
      ...waterSources.map(source => 
        [source.id, source.name, source.location, source.lat, source.lng, source.type, source.status].join(',')
      )
    ];
    
    const csvString = csvRows.join('\n');
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
    const exportFileDefaultName = 'water-sources.csv';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-accent';
      case 'maintenance':
        return 'text-secondary';
      case 'inactive':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    return <Droplet className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Water Sources</h1>
            <p className="text-xl text-primary-foreground/90">
              Explore water source locations across Turkana County
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Water Sources List */}
              <div className="lg:col-span-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Available Sources</h2>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={downloadCSV}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={downloadJSON}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      JSON
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {waterSources.map((source) => (
                    <div
                      key={source.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedSource?.id === source.id
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card hover:bg-muted border-border'
                      }`}
                      onClick={() => setSelectedSource(source)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={selectedSource?.id === source.id ? 'text-primary-foreground' : 'text-primary'}>
                          {getTypeIcon(source.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{source.name}</h3>
                          <p className={`text-sm mb-2 ${
                            selectedSource?.id === source.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                          }`}>
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {source.location}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className={`capitalize ${
                              selectedSource?.id === source.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                            }`}>
                              {source.type}
                            </span>
                            <Circle className={`h-2 w-2 fill-current ${getStatusColor(source.status)}`} />
                            <span className={`capitalize ${getStatusColor(source.status)}`}>
                              {source.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-2xl font-bold mb-6">Interactive Map</h2>
                  
                  {/* Google Maps Embed with markers */}
                  <div className="w-full h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      title="Water Sources Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=2.5,35.5&zoom=8`}
                      allowFullScreen
                    />
                  </div>

                  {/* Selected Source Info */}
                  {selectedSource && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Selected: {selectedSource.name}</h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>Location:</strong> {selectedSource.location}</p>
                        <p><strong>Coordinates:</strong> {selectedSource.lat}, {selectedSource.lng}</p>
                        <p><strong>Type:</strong> {selectedSource.type}</p>
                        <p><strong>Status:</strong> <span className={`capitalize ${getStatusColor(selectedSource.status)}`}>{selectedSource.status}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default WaterSources;
