import React, { useEffect, useState } from 'react';
import api from '../services/api';

const SearchFilterBar = ({ context = 'customer', onChange }) => {
  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', company: '', model: '', category: '' });

  useEffect(() => {
    const load = async () => {
      const [c1, c2] = await Promise.all([
        api.get('/parts/car-companies'),
        api.get('/parts/categories')
      ]);
      setCompanies(c1.data);
      setCategories(c2.data);
    };
    load();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      if (!filters.company) return setModels([]);
      const { data } = await api.get(`/parts/car-models/${filters.company}`);
      setModels(data);
    };
    loadModels();
  }, [filters.company]);

  useEffect(() => {
    if (!onChange) return;
    const base = { ...filters };
    if (context === 'customer') onChange(base);
    else if (context === 'shopkeeper') onChange(base);
    else if (context === 'admin') onChange(base);
  }, [JSON.stringify(filters)]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <input className="border p-2 rounded" placeholder="Search e.g. mirror" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
        <select className="border p-2 rounded" value={filters.company} onChange={e => setFilters({ ...filters, company: e.target.value, model: '' })}>
          <option value="">Company</option>
          {companies.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
        </select>
        <select className="border p-2 rounded" value={filters.model} onChange={e => setFilters({ ...filters, model: e.target.value })}>
          <option value="">Model</option>
          {models.map(m => <option key={m._id || m.id} value={m._id || m.id}>{m.name} ({m.year})</option>)}
        </select>
        <select className="border p-2 rounded" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
          <option value="">Category</option>
          {categories.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
        </select>
        <button className="bg-primary text-white rounded">Search</button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
