import React, { useState } from 'react';
import api from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [role] = useState('shopkeeper');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    shopDetails: {
      shopName: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    },
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('shopDetails.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        shopDetails: { ...prev.shopDetails, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, role };
      const { data } = await api.post('/auth/register', payload);
      toast.success(data.message || 'Registered successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white relative overflow-hidden">
      <div className="flex-grow flex items-start justify-center pt-20">
        <div className="relative z-10 w-full max-w-md bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-8">
        <ToastContainer />
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-wide text-primary">
            Register as Shopkeeper
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Join CarFixParts and start listing your auto parts today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-white placeholder-gray-500"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-white placeholder-gray-500"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <input
                name="password"
                type="password"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-white placeholder-gray-500"
                placeholder="Password (min 6 chars)"
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-white placeholder-gray-500"
                placeholder="Phone"
                onChange={handleChange}
                required
              />
            </div>

            <div className="bg-gray-800/60 p-5 rounded-lg border border-gray-700">
              <h2 className="font-semibold text-lg mb-4 text-primary">
                Shop Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="shopDetails.shopName"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-900/70 border border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-white placeholder-gray-500"
                  placeholder="Shop Name"
                  onChange={handleChange}
                  required
                />
                <input
                  name="shopDetails.address"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-900/70 border border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-white placeholder-gray-500"
                  placeholder="Address"
                  onChange={handleChange}
                  required
                />
                <input
                  name="shopDetails.city"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-900/70 border border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-white placeholder-gray-500"
                  placeholder="City"
                  onChange={handleChange}
                  required
                />
                <input
                  name="shopDetails.state"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-900/70 border border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-white placeholder-gray-500"
                  placeholder="State"
                  onChange={handleChange}
                  required
                />
                <input
                  name="shopDetails.pincode"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-900/70 border border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-white placeholder-gray-500"
                  placeholder="Pincode"
                  onChange={handleChange}
                  required
                />
              </div>
              <p className="text-sm text-gray-400 mt-3">
                Note: Your account will remain pending until approved by the admin.
              </p>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark transition-all duration-300 font-semibold text-white shadow-lg disabled:opacity-60 mt-4"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Register;