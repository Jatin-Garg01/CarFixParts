import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const ShopkeeperDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await api.get('/shopkeeper/dashboard-stats');
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Shopkeeper Dashboard</h1>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow"><div className="text-gray-500">Total</div><div className="text-xl font-bold">{stats.totalParts}</div></div>
          <div className="bg-white p-4 rounded shadow"><div className="text-gray-500">Available</div><div className="text-xl font-bold">{stats.availableParts}</div></div>
          <div className="bg-white p-4 rounded shadow"><div className="text-gray-500">Sold</div><div className="text-xl font-bold">{stats.soldParts}</div></div>
          <div className="bg-white p-4 rounded shadow"><div className="text-gray-500">Reserved</div><div className="text-xl font-bold">{stats.reservedParts}</div></div>
        </div>
      )}
      <div className="space-x-2">
        <a href="/shopkeeper/add-part" className="px-4 py-2 bg-primary text-white rounded">Add Part</a>
        <a href="/shopkeeper/my-parts" className="px-4 py-2 bg-gray-800 text-white rounded">My Parts</a>
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;
