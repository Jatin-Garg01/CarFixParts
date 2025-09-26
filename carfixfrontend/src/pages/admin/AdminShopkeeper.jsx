import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import PartCard from '../../components/PartCard';

const AdminShopkeeper = () => {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [page, setPage] = useState(1);

  const load = async () => {
    const { data } = await api.get(`/admin/shopkeeper/${id}`, { params: { page, limit: 12 } });
    setInfo(data);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id, page]);

  if (!info) return <div className="p-4">Loading...</div>;

  const { shopkeeper, parts, currentPage, totalPages } = info;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{shopkeeper.name}</h1>
        <div className="text-gray-700 text-sm">{shopkeeper.shopDetails?.shopName}</div>
        <div className="text-gray-600 text-sm">{shopkeeper.email} • {shopkeeper.phone}</div>
        <div className="text-gray-600 text-sm">{shopkeeper.shopDetails?.address}, {shopkeeper.shopDetails?.city}, {shopkeeper.shopDetails?.state} - {shopkeeper.shopDetails?.pincode}</div>
        <div className="text-xs mt-1 inline-block px-2 py-1 rounded bg-gray-100">Status: {shopkeeper.status}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {parts.map(p => (
          <PartCard key={p._id} part={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <div>Page {currentPage} / {totalPages}</div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminShopkeeper;
