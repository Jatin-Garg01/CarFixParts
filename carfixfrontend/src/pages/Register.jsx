import React, { useState } from 'react';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
  const [role] = useState('shopkeeper');
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    shopDetails: { shopName: '', address: '', city: '', state: '', pincode: '' }
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('shopDetails.')) {
      const key = name.split('.')[1];
      setForm(prev => ({ ...prev, shopDetails: { ...prev.shopDetails, [key]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, role: 'shopkeeper' };
      const { data } = await api.post('/auth/register', payload);
      toast.success(data.message || 'Registered successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Register as Shopkeeper</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" className="border p-2 rounded" placeholder="Full name" onChange={handleChange} required />
          <input name="email" type="email" className="border p-2 rounded" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" className="border p-2 rounded" placeholder="Password (min 6 chars)" onChange={handleChange} required />
          <input name="phone" className="border p-2 rounded" placeholder="Phone" onChange={handleChange} required />
        </div>

        <div className="bg-gray-50 p-4 rounded border">
          <h2 className="font-semibold mb-2">Shop Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="shopDetails.shopName" className="border p-2 rounded" placeholder="Shop Name" onChange={handleChange} required />
            <input name="shopDetails.address" className="border p-2 rounded" placeholder="Address" onChange={handleChange} required />
            <input name="shopDetails.city" className="border p-2 rounded" placeholder="City" onChange={handleChange} required />
            <input name="shopDetails.state" className="border p-2 rounded" placeholder="State" onChange={handleChange} required />
            <input name="shopDetails.pincode" className="border p-2 rounded" placeholder="Pincode" onChange={handleChange} required />
          </div>
          <p className="text-sm text-gray-500 mt-2">Note: Your account will be pending until admin approval.</p>
        </div>

        <button disabled={loading} className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark disabled:opacity-60">{loading ? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  );
};

export default Register;
