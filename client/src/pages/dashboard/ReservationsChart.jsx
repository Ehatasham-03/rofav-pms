import PropTypes from 'prop-types';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

// ReservationsChart Component
const ReservationsChart = ({ data = [], totalSales = 0 }) => {
  // Warn if data or totalSales is not provided
  if (data.length === 0) {
    console.warn('Data is missing or empty for ReservationsChart');
  }
  if (totalSales === 0) {
    console.warn('Total sales value is missing or zero');
  }

  // Calculate the total of all values in the data array
  const totalReservations = data.reduce((acc, item) => acc + item.value, 0);

  // Data for the doughnut chart
  const doughnutData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Reservations',
        data: data.map(item => item.value),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverOffset: 4,
      },
    ],
  };

  

  // Options for Doughnut chart with center text
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '85%',
    plugins: {
      legend: {
        display: false, // Hide the default legend
      },
      tooltip: {
        enabled: true,
      },
      // Plugin to display the total reservations in the center
      beforeDraw: (chart) => {
        const { ctx, width, height } = chart;
        ctx.restore();
        const fontSize = (height / 120).toFixed(2); // Adjust based on chart size
        ctx.font = `${fontSize}em sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333'; // Center text color

        const text = totalReservations.toString(); // Display total reservations in the center
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;

        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  };

  return (
    <div className="shadow rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-green-100 dark:bg-gray-800 text-gray-800 dark:text-white">
      {/* Chart Heading */}
      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Reservations</h3>
      
      {/* Donut Chart and Legend */}
      <div className="flex justify-between items-center">
        {/* Donut Chart */}
        <div className="h-48 w-48 ml-6"> 
          <Doughnut data={doughnutData} options={options} />
        </div>

        {/* Custom Legend */}
        <div className="flex flex-col items-start justify-center ml-2">
          {data.map((item, index) => (
            <p key={index} className="flex items-center mb-2 text-lg font-semibold">
              <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'][index] }}></span> 
              {item.name}
            </p>
          ))}
        </div>
      </div>
      
      {/* Total Sales and Additional Information */}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xl font-bold text-gray-800 dark:text-white">Total Sales</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">₹{totalSales}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
      </div>

      {/* Random Curve Graph */}
      <div className="mt-6">
        <Line 
          data={{ 
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
            datasets: [{
              label: 'Random Data',
              data: [20, 40, 60, 75, 50, 40, 55],
              fill: true,
              borderColor: '#B8621B',
              backgroundColor: 'rgba(184, 98, 27, 0.2)',
              tension: 0.4 
            }] 
          }}
          options={{ maintainAspectRatio: false }} 
          height={300} 
        />
      </div>
    </div>
  );
};

// PropTypes validation
ReservationsChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  totalSales: PropTypes.number.isRequired,
};

// Mock data for ReservationsChart
export const ReservationsData = () => {
  const data = [
    { name: 'Confirmed', value: 200 },
    { name: 'Checked In', value: 100 },
    { name: 'Checked Out', value: 44 },
  ];

  const totalSales = 1200;

  return (
    <div>
      <ReservationsChart data={data} totalSales={totalSales} />
    </div>
  );
};

export default ReservationsData;
