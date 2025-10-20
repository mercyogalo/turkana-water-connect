export interface WaterSource {
  id: number;
  name: string;
  namesLocal?: {
    en?: string;
    ki?: string;
    kln?: string;
    luo?: string;
    sw?: string;
    tuv?: string;
  };
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
    namesLocal: {
      en: 'Juja Borehole A',
      ki: 'Juja Borehole A',
      kln: 'Juja Borehole A',
      luo: 'Juja Borehole A',
      sw: 'Juja Borehole A',
      tuv: 'Juja Borehole A'
    },
    location: 'Near JKUAT Gate C',
    lat: -1.0982,
    lng: 37.0144,
    type: 'borehole',
    status: 'active',
  },
  {
    id: 2,
    name: 'Ruiru Central Well',
    namesLocal: {
      en: 'Ruiru Central Well',
      ki: 'Ruiru Central Well',
      kln: 'Ruiru Central Well',
      luo: 'Ruiru Central Well',
      sw: 'Ruiru Central Well',
      tuv: 'Ruiru Central Well'
    },
    location: 'Ruiru Town Centre',
    lat: -1.1475,
    lng: 36.9510,
    type: 'well',
    status: 'active',
  },
  {
    id: 3,
    name: 'Gatundu Spring',
    namesLocal: {
      en: 'Gatundu Spring',
      ki: 'Gatundu Spring',
      kln: 'Gatundu Spring',
      luo: 'Gatundu Spring',
      sw: 'Gatundu Spring',
      tuv: 'Gatundu Spring'
    },
    location: 'Gatundu Market Area',
    lat: -1.0325,
    lng: 36.9108,
    type: 'spring',
    status: 'active',
  },
  {
    id: 4,
    name: 'Theta River Access',
    namesLocal: {
      en: 'Theta River Access',
      ki: 'Theta River Access',
      kln: 'Theta River Access',
      luo: 'Theta River Access',
      sw: 'Theta River Access',
      tuv: 'Theta River Access'
    },
    location: 'Theta River, Juja Farm Road',
    lat: -1.0857,
    lng: 37.0503,
    type: 'river',
    status: 'active',
  },
  {
    id: 5,
    name: 'Kimbo Borehole',
    namesLocal: {
      en: 'Kimbo Borehole',
      ki: 'Kimbo Borehole',
      kln: 'Kimbo Borehole',
      luo: 'Kimbo Borehole',
      sw: 'Kimbo Borehole',
      tuv: 'Kimbo Borehole'
    },
    location: 'Along Thika Road, Kimbo',
    lat: -1.1221,
    lng: 36.9563,
    type: 'borehole',
    status: 'maintenance',
  },
  {
    id: 6,
    name: 'Juja Farm Well',
    namesLocal: {
      en: 'Juja Farm Well',
      ki: 'Juja Farm Well',
      kln: 'Juja Farm Well',
      luo: 'Juja Farm Well',
      sw: 'Juja Farm Well',
      tuv: 'Juja Farm Well'
    },
    location: 'Juja Farm',
    lat: -1.0668,
    lng: 37.0719,
    type: 'well',
    status: 'active',
  },
];
