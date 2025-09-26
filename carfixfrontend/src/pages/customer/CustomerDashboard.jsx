import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import PartCard from '../../components/PartCard';
import SearchFilterBar from '../../components/SearchFilterBar';

const CustomerDashboard = () => {
  const [data, setData] = useState({ parts: [], total: 0 });
  const [query, setQuery] = useState({ page: 1, limit: 12 });

  const load = async () => {
    const { data } = await api.get('/customer/search-parts', { params: query });
    setData(data);
  };

  useEffect(() => { load(); }, [JSON.stringify(query)]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Find Parts</h1>
      <SearchFilterBar context="customer" onChange={setQuery} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {data.parts.map(p => (
          <PartCard key={p._id} part={p} />
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
