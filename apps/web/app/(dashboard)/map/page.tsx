export default function MapPage() {
  const recyclingCenters = [
    {
      name: 'Colombo Municipal Council Recycling Center',
      address: 'Sir James Peiris Mawatha, Colombo 02',
      phone: '+94 11 232 0000',
      types: ['Plastic', 'Paper', 'Glass', 'Metal'],
      hours: 'Mon–Fri: 8am–5pm',
    },
    {
      name: 'HiEnergy Lanka E-Waste Collection',
      address: '25 Galle Road, Wellawatte, Colombo 06',
      phone: '+94 11 258 9000',
      types: ['E-Waste', 'Batteries'],
      hours: 'Mon–Sat: 9am–6pm',
    },
    {
      name: 'Kesbewa Recycling Point',
      address: 'Kesbewa Road, Piliyandala',
      phone: '+94 11 261 5500',
      types: ['Plastic', 'Paper', 'Organic'],
      hours: 'Daily: 7am–4pm',
    },
    {
      name: 'Maharagama Recycling Centre',
      address: '12 High Level Road, Maharagama',
      phone: '+94 11 284 3000',
      types: ['Plastic', 'Paper', 'Glass', 'Metal', 'Textile'],
      hours: 'Mon–Sat: 8am–5pm',
    },
    {
      name: 'Kandy Municipal Recycling Hub',
      address: 'DS Senanayake Mawatha, Kandy',
      phone: '+94 81 222 1234',
      types: ['All Recyclables', 'Compost Drop-off'],
      hours: 'Tue, Thu, Sat: 7am–1pm',
    },
  ];

  const typeColors: Record<string, string> = {
    Plastic: 'bg-blue-100 text-blue-700',
    Paper: 'bg-green-100 text-green-700',
    Glass: 'bg-cyan-100 text-cyan-700',
    Metal: 'bg-gray-100 text-gray-700',
    'E-Waste': 'bg-purple-100 text-purple-700',
    Batteries: 'bg-red-100 text-red-700',
    Organic: 'bg-yellow-100 text-yellow-700',
    Textile: 'bg-pink-100 text-pink-700',
    'All Recyclables': 'bg-green-100 text-green-700',
    'Compost Drop-off': 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Recycling Map</h1>
        <p className="text-gray-500 text-sm mt-1">Find recycling centers near you</p>
      </div>

      {/* Map placeholder */}
      <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl h-48 flex flex-col items-center justify-center border-2 border-dashed border-green-300">
        <div className="text-5xl mb-3">🗺️</div>
        <p className="font-semibold text-gray-700">Interactive Map</p>
        <p className="text-xs text-gray-500 mt-1 text-center px-4">
          GPS-based recycler locator coming soon. Use the directory below to find centers.
        </p>
      </div>

      {/* Centers list */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3">Sri Lanka Recycling Centers</h2>
        <div className="space-y-4">
          {recyclingCenters.map((center, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  📍
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{center.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{center.address}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {center.types.map((type) => (
                  <span
                    key={type}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      typeColors[type] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {type}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>⏰ {center.hours}</span>
                <a
                  href={`tel:${center.phone}`}
                  className="text-green-600 font-medium hover:underline"
                >
                  📞 {center.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
        <p className="text-sm text-blue-700 font-medium mb-1">💡 Tip</p>
        <p className="text-xs text-blue-600">
          Call ahead to confirm hours and accepted materials. Some centers may require items
          to be cleaned and sorted before drop-off.
        </p>
      </div>
    </div>
  );
}
