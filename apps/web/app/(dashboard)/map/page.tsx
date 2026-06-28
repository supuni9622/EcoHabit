'use client';

import { useState } from 'react';

interface RecyclingCentre {
  name: string;
  address: string;
  city: string;
  wasteTypes: string[];
  phone?: string;
  hours: string;
  lat?: number;
  lng?: number;
}

const CENTRES: RecyclingCentre[] = [
  {
    name: 'Central Environment Authority (CEA)',
    address: 'No. 104, Denzil Kobbekaduwa Mawatha',
    city: 'Battaramulla, Colombo',
    wasteTypes: ['Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Organic'],
    phone: '0112877290',
    hours: 'Mon–Fri 8:30 AM – 4:30 PM',
    lat: 6.9056,
    lng: 79.9197,
  },
  {
    name: 'Colombo Municipal Recycling Centre',
    address: 'Bloemendhal Road',
    city: 'Colombo 13',
    wasteTypes: ['Plastic', 'Paper', 'Glass', 'Metal'],
    phone: '0112324459',
    hours: 'Mon–Sat 7:00 AM – 5:00 PM',
    lat: 6.9479,
    lng: 79.8638,
  },
  {
    name: 'Eco Green Lanka',
    address: 'Raja Mawatha',
    city: 'Rajagiriya, Colombo',
    wasteTypes: ['Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Organic'],
    phone: '0777123456',
    hours: 'Mon–Sat 8:00 AM – 6:00 PM',
    lat: 6.9102,
    lng: 79.8949,
  },
  {
    name: 'Kelaniya Recycling Hub',
    address: 'Kandy Road',
    city: 'Kelaniya',
    wasteTypes: ['Plastic', 'Paper', 'Organic'],
    hours: 'Mon–Sat 7:00 AM – 5:00 PM',
    lat: 7.0014,
    lng: 79.9207,
  },
  {
    name: 'Kandy Recycling Centre',
    address: 'Peradeniya Road',
    city: 'Kandy',
    wasteTypes: ['Plastic', 'Paper', 'Glass'],
    phone: '0812223344',
    hours: 'Mon–Sat 8:00 AM – 5:00 PM',
    lat: 7.2906,
    lng: 80.6337,
  },
  {
    name: 'Galle Eco Station',
    address: 'Wakwella Road',
    city: 'Galle',
    wasteTypes: ['Plastic', 'Paper', 'Metal'],
    hours: 'Mon–Fri 8:00 AM – 4:00 PM',
    lat: 6.0535,
    lng: 80.2210,
  },
  {
    name: 'Nugegoda Green Centre',
    address: 'High Level Road',
    city: 'Nugegoda',
    wasteTypes: ['Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Organic'],
    phone: '0112814567',
    hours: 'Mon–Sat 8:00 AM – 6:00 PM',
    lat: 6.8726,
    lng: 79.8909,
  },
  {
    name: 'Moratuwa Recycling Depot',
    address: 'Rawatawatte Road',
    city: 'Moratuwa',
    wasteTypes: ['Plastic', 'Metal', 'Glass'],
    hours: 'Mon–Sat 7:00 AM – 5:00 PM',
    lat: 6.7731,
    lng: 79.8817,
  },
  {
    name: 'Dehiwala E-Waste Hub',
    address: 'De Saram Place',
    city: 'Mt. Lavinia',
    wasteTypes: ['E-Waste'],
    phone: '0777234567',
    hours: 'Mon–Sat 9:00 AM – 6:00 PM',
    lat: 6.8277,
    lng: 79.8719,
  },
  {
    name: 'HiEnergy Lanka',
    address: 'New Kelani Bridge Road',
    city: 'Peliyagoda',
    wasteTypes: ['E-Waste'],
    phone: '0112912345',
    hours: 'Mon–Fri 8:00 AM – 5:00 PM',
    lat: 6.9621,
    lng: 79.8868,
  },
  {
    name: 'Ratnapura Eco Centre',
    address: 'Main Street',
    city: 'Ratnapura',
    wasteTypes: ['Plastic', 'Organic'],
    hours: 'Mon–Fri 8:00 AM – 4:00 PM',
    lat: 6.6828,
    lng: 80.3992,
  },
  {
    name: 'Matara Green Depot',
    address: 'Anamaduwa Road',
    city: 'Matara',
    wasteTypes: ['Plastic', 'Paper', 'Glass'],
    hours: 'Mon–Sat 7:00 AM – 5:00 PM',
    lat: 5.9549,
    lng: 80.5550,
  },
  {
    name: 'Negombo Recycling Point',
    address: 'Lewis Place',
    city: 'Negombo',
    wasteTypes: ['Plastic', 'Paper', 'Metal'],
    hours: 'Mon–Sat 8:00 AM – 5:00 PM',
    lat: 7.2120,
    lng: 79.8380,
  },
  {
    name: 'Anuradhapura Green Station',
    address: 'Inner Circular Road',
    city: 'Anuradhapura',
    wasteTypes: ['Organic', 'Paper'],
    hours: 'Mon–Fri 8:00 AM – 4:00 PM',
    lat: 8.3114,
    lng: 80.4037,
  },
  {
    name: 'Kurunegala Eco Hub',
    address: 'Kandy Road',
    city: 'Kurunegala',
    wasteTypes: ['Plastic', 'Glass', 'Metal'],
    hours: 'Mon–Sat 8:00 AM – 5:00 PM',
    lat: 7.4818,
    lng: 80.3609,
  },
  {
    name: 'Batticaloa Recycling Centre',
    address: 'Bar Road',
    city: 'Batticaloa',
    wasteTypes: ['Plastic', 'Paper'],
    hours: 'Mon–Fri 8:00 AM – 4:00 PM',
    lat: 7.7310,
    lng: 81.6747,
  },
  {
    name: 'Jaffna Eco Point',
    address: 'Hospital Road',
    city: 'Jaffna',
    wasteTypes: ['Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Organic'],
    hours: 'Mon–Fri 8:00 AM – 4:00 PM',
    lat: 9.6615,
    lng: 80.0255,
  },
  {
    name: 'Wattala Green Centre',
    address: 'Hendala',
    city: 'Wattala',
    wasteTypes: ['Plastic', 'Paper', 'E-Waste'],
    hours: 'Mon–Sat 8:00 AM – 6:00 PM',
    lat: 6.9925,
    lng: 79.8891,
  },
  {
    name: 'Piliyandala Depot',
    address: 'High Level Road',
    city: 'Piliyandala',
    wasteTypes: ['Plastic', 'Metal', 'Glass'],
    hours: 'Mon–Sat 7:00 AM – 5:00 PM',
    lat: 6.8005,
    lng: 79.9188,
  },
  {
    name: 'Homagama Recycling Hub',
    address: 'Avissawella Road',
    city: 'Homagama',
    wasteTypes: ['Organic', 'Plastic', 'Paper'],
    hours: 'Mon–Sat 8:00 AM – 5:00 PM',
    lat: 6.8413,
    lng: 80.0030,
  },
];

const ALL_WASTE_TYPES = ['All', 'Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Organic'];

const TYPE_COLORS: Record<string, string> = {
  Plastic: 'bg-blue-100 text-blue-700',
  Paper: 'bg-green-100 text-green-700',
  Glass: 'bg-cyan-100 text-cyan-700',
  Metal: 'bg-gray-100 text-gray-700',
  'E-Waste': 'bg-purple-100 text-purple-700',
  Organic: 'bg-yellow-100 text-yellow-700',
};

export default function MapPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [locationMessage, setLocationMessage] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const filteredCentres =
    activeFilter === 'All'
      ? CENTRES
      : CENTRES.filter((c) => c.wasteTypes.includes(activeFilter));

  const handleFindNearMe = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Geolocation is not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    setLocationMessage('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationMessage(
          `Your location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}. Use the Google Maps links below to get directions to the nearest centre.`
        );
        setLocationLoading(false);
      },
      () => {
        setLocationMessage('Unable to access your location. Please allow location access and try again.');
        setLocationLoading(false);
      }
    );
  };

  const getDirectionsUrl = (centre: RecyclingCentre): string => {
    const query = encodeURIComponent(`${centre.name}, ${centre.address}, ${centre.city}, Sri Lanka`);
    if (centre.lat && centre.lng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${centre.lat},${centre.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Recycling Map</h1>
        <p className="text-gray-500 text-sm mt-1">Find recycling centres near you in Sri Lanka</p>
      </div>

      {/* Map area */}
      {apiKey ? (
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <iframe
            title="Sri Lanka Recycling Centres Map"
            width="100%"
            height="260"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=recycling+centre+Sri+Lanka&zoom=8`}
          />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl h-44 flex flex-col items-center justify-center border-2 border-dashed border-green-300 px-6 text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <p className="font-semibold text-gray-700 text-sm">Interactive Map</p>
          <p className="text-xs text-gray-500 mt-1">
            Add <span className="font-mono bg-white px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span> to enable the interactive map
          </p>
        </div>
      )}

      {/* Find Near Me */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleFindNearMe}
          disabled={locationLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {locationLoading ? (
            <>
              <span className="animate-spin">⟳</span>
              Locating...
            </>
          ) : (
            <>
              📍 Find Near Me
            </>
          )}
        </button>
      </div>

      {locationMessage && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
          <p className="text-xs text-blue-700">{locationMessage}</p>
        </div>
      )}

      {/* Filter buttons */}
      <div>
        <p className="text-xs text-gray-500 mb-2 font-medium">Filter by waste type</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ALL_WASTE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                activeFilter === type
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Centres list */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3">
          {filteredCentres.length} centre{filteredCentres.length !== 1 ? 's' : ''}{' '}
          {activeFilter !== 'All' ? `accepting ${activeFilter}` : 'in Sri Lanka'}
        </h2>
        <div className="space-y-4">
          {filteredCentres.map((centre, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  📍
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">{centre.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{centre.address}, {centre.city}</p>
                </div>
              </div>

              {/* Waste type chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {centre.wasteTypes.map((type) => (
                  <span
                    key={type}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      TYPE_COLORS[type] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {type}
                  </span>
                ))}
              </div>

              {/* Hours and phone */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>⏰ {centre.hours}</span>
                {centre.phone && (
                  <a
                    href={`tel:${centre.phone}`}
                    className="text-green-600 font-medium hover:underline"
                  >
                    📞 {centre.phone}
                  </a>
                )}
              </div>

              {/* Get Directions button */}
              <a
                href={getDirectionsUrl(centre)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-green-50 border border-green-200 text-green-700 py-2 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
              >
                Get Directions →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
        <p className="text-sm text-blue-700 font-medium mb-1">Tip</p>
        <p className="text-xs text-blue-600">
          Call ahead to confirm hours and accepted materials. Some centres may require items to be
          cleaned and sorted before drop-off. Your local kalagedi vendor can also collect glass,
          metal, and paper directly from your home.
        </p>
      </div>
    </div>
  );
}
