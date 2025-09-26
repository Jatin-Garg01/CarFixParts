import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const PendingShopkeepers = () => {
  const [list, setList] = useState([]);

  const load = async () => {
    const { data } = await api.get('/admin/pending-shopkeepers');
    setList(data);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id, status) => {
    try {
      await api.put(`/admin/approve-shopkeeper/${id}`, { status });
      toast.success(`Shopkeeper ${status}`);
      load();
    } catch (e) {
      toast.error('Action failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pending Shopkeeper Requests</h1>
      <div className="space-y-3">
        {list.map(u => (
          <div key={u._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{u.name} ({u.email})</div>
              <div className="text-sm text-gray-600">{u.shopDetails?.shopName} - {u.shopDetails?.city}, {u.shopDetails?.state}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleApprove(u._id, 'approved')} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
              <button onClick={() => handleApprove(u._id, 'rejected')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="text-gray-500">No pending requests</div>}
      </div>
    </div>
  );
};

export default PendingShopkeepers;
