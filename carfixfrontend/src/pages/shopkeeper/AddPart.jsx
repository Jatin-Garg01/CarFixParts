import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AddPart = () => {
  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState([]);
  const [carNames, setCarNames] = useState([]);
  const [years, setYears] = useState([]);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    name: '', description: '', sellingPrice: '', purchasedPrice: '', condition: 'used',
    carCompany: '', car: '', year: '', carModel: '', category: '', warranty: ''
  });

  useEffect(() => {
    const loadBasics = async () => {
      const [c1, c2] = await Promise.all([
        api.get('/parts/car-companies'),
        api.get('/parts/categories')
      ]);
      setCompanies(c1.data);
      setCategories(c2.data);
    };
    loadBasics();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      if (!form.carCompany) return setModels([]);
      const { data } = await api.get(`/parts/car-models/${form.carCompany}`);
      setModels(data);
      const uniqueNames = Array.from(new Set(data.map(m => m.name)));
      setCarNames(uniqueNames);
      setYears([]);
      setForm(prev => ({ ...prev, car: '', year: '', carModel: '' }));
    };
    loadModels();
  }, [form.carCompany]);

  useEffect(() => {
    if (!form.car || models.length === 0) {
      setYears([]);
      setForm(prev => ({ ...prev, year: '', carModel: '' }));
      return;
    }
    const yrs = Array.from(new Set(models.filter(m => m.name === form.car).map(m => m.year)))
      .sort((a, b) => b - a);
    setYears(yrs);
    setForm(prev => ({ ...prev, year: '', carModel: '' }));
  }, [form.car, models]);

  useEffect(() => {
    if (!form.year || !form.car) {
      setForm(prev => ({ ...prev, carModel: '' }));
      return;
    }
    const match = models.find(m => m.name === form.car && m.year === Number(form.year));
    setForm(prev => ({ ...prev, carModel: match ? (match.id || match._id) : '' }));
  }, [form.year, form.car, models]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // specifications removed

  const handleImages = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.carCompany || !form.car || !form.year || !form.carModel) {
      toast.error('Please select company, car and year');
      return;
    }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach(img => fd.append('images', img));

    try {
      await api.post('/shopkeeper/add-part', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Part added');
      setForm({ name: '', description: '', sellingPrice: '', purchasedPrice: '', condition: 'used', carCompany: '', car: '', year: '', carModel: '', category: '', warranty: '' });
      setImages([]);
    } catch (e) {
      toast.error('Failed to add part');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Part</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" className="border p-2 rounded" placeholder="Part name" value={form.name} onChange={handleChange} required />
          <input name="sellingPrice" type="number" className="border p-2 rounded" placeholder="Selling Price" value={form.sellingPrice} onChange={handleChange} required />
          <input name="purchasedPrice" type="number" className="border p-2 rounded" placeholder="Purchased Price (optional)" value={form.purchasedPrice} onChange={handleChange} />
          <select name="condition" className="border p-2 rounded" value={form.condition} onChange={handleChange}>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
          <select name="category" className="border p-2 rounded" value={form.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
          </select>
          <select name="carCompany" className="border p-2 rounded" value={form.carCompany} onChange={handleChange} required>
            <option value="">Select Company</option>
            {companies.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
          </select>
          <select name="car" className="border p-2 rounded" value={form.car} onChange={handleChange} disabled={!form.carCompany} required>
            <option value="">Select Car</option>
            {carNames.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <select name="year" className="border p-2 rounded" value={form.year} onChange={handleChange} disabled={!form.car} required>
            <option value="">Select Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <textarea name="description" className="border p-2 rounded w-full" rows="3" placeholder="Description (optional)" value={form.description} onChange={handleChange} />

        {/* Specifications removed as per requirement */}

        <div>
          <label className="block font-semibold mb-2">Images (optional, up to 5)</label>
          <input type="file" multiple accept="image/*" onChange={handleImages} />
        </div>

        <input name="warranty" className="border p-2 rounded w-full" placeholder="Warranty (optional)" value={form.warranty} onChange={handleChange} />

        <button className="px-4 py-2 bg-primary text-white rounded">Add Part</button>
      </form>
    </div>
  );
};

export default AddPart;
