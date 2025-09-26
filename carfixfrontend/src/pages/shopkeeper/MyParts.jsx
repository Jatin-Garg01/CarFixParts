import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import PartCard from '../../components/PartCard';
import SearchFilterBar from '../../components/SearchFilterBar';
import { toast } from 'react-toastify';

const MyParts = () => {
  const [data, setData] = useState({ parts: [], total: 0 });
  const [query, setQuery] = useState({ page: 1, limit: 12 });

  const load = async () => {
    const { data } = await api.get('/shopkeeper/my-parts', { params: query });
    setData(data);
  };

  useEffect(() => { load(); }, [JSON.stringify(query)]);

  const markSold = async (id) => {
    try {
      await api.put(`/shopkeeper/mark-sold/${id}`);
      toast.success('Marked as sold');
      load();
    } catch (e) {
      toast.error('Failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Parts</h1>
      </div>
      <SearchFilterBar context="shopkeeper" onChange={setQuery} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {data.parts.map(p => (
          <PartCard key={p._id} part={p} actionLabel="Mark Sold" onAction={() => markSold(p._id)} showPurchased />
        ))}
      </div>
    </div>
  );
};

export default MyParts;
