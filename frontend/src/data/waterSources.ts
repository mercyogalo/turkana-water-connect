export interface WaterSource {
  id: number;
  name: string;
  location: string;
  lat: number;
  lng: number;
  type: 'borehole' | 'well' | 'spring' | 'river';
  status: 'active' | 'maintenance' | 'inactive';
}

export const waterSources: WaterSource[] = [
  {
    id: 1,
    name: 'Juja Borehole A',
    location: 'Near JKUAT Gate C',
    lat: -1.0982,
    lng: 37.0144,
    type: 'borehole',
    status: 'active',
  },
  {
    id: 2,
    name: 'Ruiru Central Well',
    location: 'Ruiru Town Centre',
    lat: -1.1475,
    lng: 36.9510,
    type: 'well',
    status: 'active',
  },
  {
    id: 3,
    name: 'Gatundu Spring',
    location: 'Gatundu Market Area',
    lat: -1.0325,
    lng: 36.9108,
    type: 'spring',
    status: 'active',
  },
  {
    id: 4,
    name: 'Theta River Access',
    location: 'Theta River, Juja Farm Road',
    lat: -1.0857,
    lng: 37.0503,
    type: 'river',
    status: 'active',
  },
  {
    id: 5,
    name: 'Kimbo Borehole',
    location: 'Along Thika Road, Kimbo',
    lat: -1.1221,
    lng: 36.9563,
    type: 'borehole',
    status: 'maintenance',
  },
  {
    id: 6,
    name: 'Juja Farm Well',
    location: 'Juja Farm',
    lat: -1.0668,
    lng: 37.0719,
    type: 'well',
    status: 'active',
  },
];
