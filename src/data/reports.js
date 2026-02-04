// Pre-aggregated 12-month summary data for reports charts
const reportData = {
  monthlySpending: [
    { month: 'Feb', total: 28500, food: 9200, transport: 3100, shopping: 5800, bills: 4200, entertainment: 2400, health: 1200, education: 800, personal: 1800 },
    { month: 'Mar', total: 31200, food: 10100, transport: 3400, shopping: 6200, bills: 4100, entertainment: 2800, health: 1500, education: 600, personal: 2400 },
    { month: 'Apr', total: 26800, food: 8900, transport: 2800, shopping: 5100, bills: 4300, entertainment: 2200, health: 900, education: 900, personal: 1700 },
    { month: 'May', total: 29400, food: 9600, transport: 3200, shopping: 5600, bills: 4100, entertainment: 2600, health: 1100, education: 1200, personal: 2000 },
    { month: 'Jun', total: 32100, food: 10500, transport: 3600, shopping: 6800, bills: 4200, entertainment: 2900, health: 800, education: 700, personal: 2600 },
    { month: 'Jul', total: 35800, food: 11200, transport: 4100, shopping: 7500, bills: 4400, entertainment: 3800, health: 1400, education: 500, personal: 2900 },
    { month: 'Aug', total: 27900, food: 9000, transport: 3000, shopping: 5200, bills: 4100, entertainment: 2400, health: 1200, education: 1000, personal: 1900 },
    { month: 'Sep', total: 28600, food: 9300, transport: 3100, shopping: 5400, bills: 4200, entertainment: 2500, health: 1000, education: 1100, personal: 2000 },
    { month: 'Oct', total: 33400, food: 10800, transport: 3400, shopping: 7200, bills: 4300, entertainment: 2700, health: 1300, education: 900, personal: 2800 },
    { month: 'Nov', total: 29100, food: 9500, transport: 3200, shopping: 5800, bills: 4100, entertainment: 2600, health: 1000, education: 800, personal: 2100 },
    { month: 'Dec', total: 34600, food: 11000, transport: 3600, shopping: 7800, bills: 4200, entertainment: 3200, health: 1100, education: 600, personal: 3100 },
    { month: 'Jan', total: 26900, food: 8800, transport: 2900, shopping: 5100, bills: 4000, entertainment: 2300, health: 900, education: 1000, personal: 1900 },
  ],
  categoryTotals: [
    { category: 'Food & Dining', total: 117900, color: '#FF9500' },
    { category: 'Transportation', total: 38400, color: '#5AC8FA' },
    { category: 'Shopping', total: 73500, color: '#AF52DE' },
    { category: 'Bills & Utilities', total: 50200, color: '#FFD60A' },
    { category: 'Entertainment', total: 32400, color: '#FF375F' },
    { category: 'Healthcare', total: 13400, color: '#30D158' },
    { category: 'Education', total: 10100, color: '#64D2FF' },
    { category: 'Personal Care', total: 27500, color: '#FF6B6B' },
  ],
  topMerchants: [
    { merchant: 'Swapno Supermarket', total: 42800, count: 18, category: 'Food & Dining' },
    { merchant: 'Agora', total: 28400, count: 14, category: 'Food & Dining' },
    { merchant: 'Daraz', total: 24600, count: 8, category: 'Shopping' },
    { merchant: 'Pathao Ride', total: 18200, count: 52, category: 'Transportation' },
    { merchant: 'BREB Electricity', total: 17800, count: 12, category: 'Bills & Utilities' },
    { merchant: 'Uber Bangladesh', total: 14900, count: 38, category: 'Transportation' },
    { merchant: 'Costa Coffee', total: 8200, count: 32, category: 'Food & Dining' },
  ],
};

export default reportData;
