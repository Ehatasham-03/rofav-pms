import React from "react";

// function dashboard() {
//   return <div>dashboard</div>;
// }

// export default dashboard;

import StatsCard from './StatsCard';
import ReservationsChart from './ReservationsChart';
import AdminDashboard from './AdminDashboard';
import GrossSales from './GrossSales';
import Complaints from './Complaints';

const DashboardStats = () => {
  const stats = [
    { label: 'Total Properties', value: 20, change: '+10%', icon: '🏠' },
    { label: 'Revenue', value: 528, change: '+16%', icon: '₹', isCurrency: true },
    { label: 'Properties Sale', value: 226, change: '-11%', icon: '🏷️' },
  ];

  const reservationsData = [
    { label: 'Confirmed', value: 355, change: '+10%', icon: '✅' },
    { label: 'Check-In', value: 200, change: '+5%', icon: '🛎️' },
    { label: 'Checked Out', value: 100, change: '-2%', icon: '🏁' },
  ];

  const overviewData = [
    { label: 'Total Reservations', value: 500 },
    { label: 'Pending Payments', value: 120 },
  ];

  const grossSalesData = [
    { label: 'Sales', value: '₹20.4K', change: '+10.02%' },
    { label: 'Bookings', value: '144', change: '+10.02%' },
    { label: 'Avg Booking Value', value: '₹120.4K', change: '+10.02%' },
    { label: 'Refunds', value: '22', change: '+10.02%' },
    { label: 'Discounts', value: '₹2.4K', change: '+10.02%' },
  ];

  const complaintsData = [
    { label: 'Total Complaints', value: 15 },
    { label: 'Resolved', value: 10 },
    { label: 'Pending', value: 5 },
  ];

  return (
    <div className="p-4 space-y-4 bg-gray-200 dark:bg-[#080F26]  text-gray-900">
      <h1 className="text-lg font-bold p-4 text-gray-800 dark:text-white">
        <p className="text-lg font-bold">Welcome Back!</p>
      </h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} stat={stat} />
        ))}
      </div>
  
      {/* Reservations and Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReservationsChart data={reservationsData} />
        <AdminDashboard data={overviewData} />
      </div>

      {/* Gross Sales and Complaints */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GrossSales data={grossSalesData} />
        <Complaints data={complaintsData} />
      </div>
    </div>
  );
};

export default DashboardStats;

