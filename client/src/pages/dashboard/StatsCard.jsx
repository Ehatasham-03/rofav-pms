import PropTypes from 'prop-types';

// StatsCard Component
const StatsCard = ({ stat }) => (
  <div className="shadow rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
  

    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">
          {stat.isCurrency && '₹'}{stat.value}
        </p>
        <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {stat.change} from last month
        </p>
      </div>
      <div className="text-3xl">
        {stat.icon} {/* Render icon */} 
      </div>
    </div>
  </div>
);

// PropTypes validation for StatsCard
StatsCard.propTypes = {
  stat: PropTypes.shape({
    label: PropTypes.string.isRequired,      // Label for the stat (e.g., 'Revenue')
    isCurrency: PropTypes.bool,              // Boolean to check if value is currency
    value: PropTypes.oneOfType([             // Allows for string or number
      PropTypes.number.isRequired,
      PropTypes.string.isRequired,
    ]),
    change: PropTypes.string.isRequired,     // Percentage change string (e.g., '+5%')
    icon: PropTypes.node.isRequired,         // Icon (React node, could be JSX or emoji)
  }).isRequired,
};

export default StatsCard;
