import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import SearchFilterBar from '../../components/SearchFilterBar';
import PartCard from '../../components/PartCard';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ search: '', company: '', model: '', category: '' });
  const [partsData, setPartsData] = useState({ parts: [], total: 0, totalPages: 0, currentPage: 1 });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await api.get('/admin/dashboard-stats');
      setStats(data);
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const loadParts = async () => {
      const params = { page, limit: 12, ...filters };
      const { data } = await api.get('/admin/all-parts', { params });
      setPartsData(data);
    };
    loadParts();
  }, [JSON.stringify(filters), page]);

  const nextPage = () => {
    if (partsData.currentPage < partsData.totalPages) setPage(p => p + 1);
  };
  const prevPage = () => {
    if (partsData.currentPage > 1) setPage(p => p - 1);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Overview and global search</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow"><div className="text-gray-500">Shopkeepers</div><div className="text-xl font-bold">{stats.shopkeepers.total}</div></div>
          <div className="bg-white p-4 rounded shadow"><div className="text-gray-500">Pending</div><div className="text-xl font-bold">{stats.shopkeepers.pending}</div></div>
          <div className="bg-white p-4 rounded shadow"><div className="text-gray-500">Parts</div><div className="text-xl font-bold">{stats.parts.total}</div></div>
          <div className="bg-white p-4 rounded shadow"><div className="text-gray-500">Customers</div><div className="text-xl font-bold">{stats.customers}</div></div>
        </div>
      )}

      <SearchFilterBar context="admin" onChange={setFilters} />

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {partsData.parts.map(p => (
          <div key={p._id} className="relative">
            <PartCard part={p} />
            {p.shopkeeper?.name && (
              <Link to={`/admin/shopkeeper/${p.shopkeeper.id}`} className="absolute top-2 left-2 bg-white/90 text-xs px-2 py-1 rounded shadow hover:underline">
                {p.shopkeeper.name}
              </Link>
            )}
          </div>
        ))}
      </div>

      {partsData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={prevPage} disabled={partsData.currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <div>Page {partsData.currentPage} / {partsData.totalPages}</div>
          <button onClick={nextPage} disabled={partsData.currentPage === partsData.totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
