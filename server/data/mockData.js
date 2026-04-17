const mockData = {
  stats: {
    annualTarget: 62,
    totalStock: 187,
    pipeline: 64,
    lowStock: 8,
    openOrders: 3
  },
  categories: [
    { name: 'Light Commercial (LCV)', models: 20, series: 'Trucks HFC series', units: 82, target: 68, color: '#1D9E75', bg: '#E1F5EE' },
    { name: 'Passenger Cars (PC)', models: 11, series: 'JS / J7 series', units: 74, target: 74, color: '#7F77DD', bg: '#EEEDFE' },
    { name: 'Heavy Trucks (HT)', models: 2, series: 'HFC3255 / HFC4180', units: 18, target: 45, color: '#BA7517', bg: '#FAEEDA' },
    { name: 'Special Machinery (SM)', models: 3, series: 'RF8 / CPCD forklifts', units: 13, target: 52, color: '#D85A30', bg: '#FAECE7' },
  ],
  suggestions: [
    { model: 'HFC3255K1R1', name: '10T Dumper Truck 6x4', status: 'only 3 units left', level: 'critical' },
    { model: 'JS8-Flagship', name: 'Luxury SUV', status: '2 units left', level: 'critical' },
  ],
  inventory: [
    { code: 'HFC 1020-B', name: '1.7T Plateau – Blue', category: 'LCV', stock: 12, pipeline: 6, fobPrice: 7800 },
    { code: 'HFC 1020-W', name: '1.7T Plateau – White', category: 'LCV', stock: 9, pipeline: 4, fobPrice: 7800 },
  ]
};

module.exports = mockData;
