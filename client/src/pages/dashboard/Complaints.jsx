import PropTypes from 'prop-types';
import rakeshDp from '../../assets/rrakesh.png';
import vikasDp from '../../assets/vikas.svg';

// Complaints Component
const Complaints = ({ data }) => (
  <div className="rounded-lg p-6 bg-green-100 dark:bg-[#1e293b] text-gray-800 dark:text-white w-full max-w-md mx-auto border border-gray-300 dark:border-gray-600">
    <div className="flex items-center mb-6">
      <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center mr-3">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold">Complaints</h3>
    </div>

    {/* Horizontal line */}
    <hr className="border-gray-300 dark:border-gray-600 mb-6" />

    <div className="space-y-6">
      {data.map((complaint, index) => (
        <div key={index} className="flex flex-col space-y-2">
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <img
              src={complaint.dp}
              alt={`${complaint.user}'s profile`}
              className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
            />
            <div>
              <p className="font-semibold text-lg">{complaint.user}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{complaint.location}</p>
            </div>
          </div>
          <div className="ml-16 bg-gray-100 dark:bg-[#0f172a] rounded-lg p-3 flex justify-between items-center">
            <p className="text-xs">{complaint.complaint}</p>
            <p className="text-sm font-medium text-red-500">
              Loss Amt - ₹{complaint.loss.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Define PropTypes
Complaints.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      complaint: PropTypes.string.isRequired,
      loss: PropTypes.number.isRequired,
      dp: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// Data to be integrated
export const ComplaintsData = () => {
  const data = [
    { user: "Rakesh", location: "Yellow Bells Gachibowli", complaint: "TV damaged", loss: 20000, dp: rakeshDp },
    { user: "Vikas", location: "Rofabs Retreat", complaint: "Heater not working", loss: 10000, dp: vikasDp },
  ];

  return <Complaints data={data} />;
};

export default ComplaintsData;
