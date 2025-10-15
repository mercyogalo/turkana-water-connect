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
    name: 'Lodwar Central Borehole',
    location: 'Lodwar Town',
    lat: 3.1197,
    lng: 35.5969,
    type: 'borehole',
    status: 'active',
  },
  {
    id: 2,
    name: 'Kakuma Well',
    location: 'Kakuma',
    lat: 3.1212,
    lng: 34.8761,
    type: 'well',
    status: 'active',
  },
  {
    id: 3,
    name: 'Lokitaung Spring',
    location: 'Lokitaung',
    lat: 4.2647,
    lng: 35.7136,
    type: 'spring',
    status: 'active',
  },
  {
    id: 4,
    name: 'Kalokol Borehole',
    location: 'Kalokol',
    lat: 3.4844,
    lng: 35.8667,
    type: 'borehole',
    status: 'active',
  },
  {
    id: 5,
    name: 'Lokichar Water Point',
    location: 'Lokichar',
    lat: 2.3667,
    lng: 35.2833,
    type: 'well',
    status: 'maintenance',
  },
  {
    id: 6,
    name: 'Turkwel River Access',
    location: 'Turkwel',
    lat: 2.7667,
    lng: 35.3333,
    type: 'river',
    status: 'active',
  },
];
