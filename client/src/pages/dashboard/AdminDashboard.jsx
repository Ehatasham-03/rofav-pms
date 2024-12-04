import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

const data = [
  { name: 'Mon', Visited: 100, Booked: 80 },
  { name: 'Tue', Visited: 120, Booked: 100 },
  { name: 'Wed', Visited: 90, Booked: 70 },
  { name: 'Thu', Visited: 180, Booked: 140 },
  { name: 'Fri', Visited: 160, Booked: 120 },
  { name: 'Sat', Visited: 130, Booked: 110 },
  { name: 'Sun', Visited: 150, Booked: 130 },
];

const AdminDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if dark mode is active
  useEffect(() => {
    const darkModeClass = document.documentElement.classList.contains('dark');
    setIsDarkMode(darkModeClass);
  }, []);

  return (
    <div className="p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-pink-100 dark:bg-gray-800 text-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Overview</h2>
        <select className="px-3 py-1 rounded border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
          <option>This Week</option>
        </select>
      </div>

      <div className="flex justify-between items-center mb-4 space-x-2">
        <div className="flex p-3 rounded-lg w-1/3 space-x-4 items-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="text-center">
            <h3 className="text-sm mb-1 text-gray-800 dark:text-white">Booked</h3>
            <p className="text-2xl font-bold text-[#EC4899]">154</p>
          </div>
          <div className="text-center">
            <h3 className="text-sm mb-1 text-gray-800 dark:text-white">Visited</h3>
            <p className="text-2xl font-bold text-[#F59E0B]">294</p>
          </div>
        </div>
        <div className="flex-grow p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h3 className="text-sm mb-1 text-gray-800 dark:text-white">Performance</h3>
          <p className="text-base">
            <span className="text-[#10B981]">14% </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">from last month</span>
          </p>
        </div>
      </div>

      <div className="h-52 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="name" 
              stroke={isDarkMode ? 'white' : 'black'}
              tick={{ fill: isDarkMode ? 'white' : 'black' }}
              axisLine={{ stroke: isDarkMode ? 'white' : 'black' }}
              tickLine={{ stroke: isDarkMode ? 'white' : 'black' }}
            />
            <YAxis 
              stroke={isDarkMode ? 'white' : 'black'}
              tick={{ fill: isDarkMode ? 'white' : 'black' }}
              axisLine={{ stroke: isDarkMode ? 'white' : 'black' }}
              tickLine={{ stroke: isDarkMode ? 'white' : 'black' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                borderColor: isDarkMode ? '#4B5563' : '#cccccc',
              }}
              itemStyle={{ color: isDarkMode ? '#ffffff' : '#000000' }}
              formatter={(value, name) => [value, name === 'Visited' ? 'Visited' : 'Booked']}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="Visited"
              stroke="#EC4899"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8, stroke: '#F59E0B', fill: '#EC4899' }}
            />
            <Line
              type="monotone"
              dataKey="Booked"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8, stroke: '#EC4899', fill: '#F59E0B' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
