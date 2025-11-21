import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bck from '../assets/images/bck.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      const redirect =
        data.user.role === 'admin'
          ? '/admin'
          : data.user.role === 'shopkeeper'
          ? '/shopkeeper'
          : '/customer';
      const from = location.state?.from?.pathname || redirect;
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white relative overflow-hidden">
      {/* <div
        className="absolute inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bck})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
        }}
      ></div> */}
      {/* Background gradient to match navbar */}
      <div className="flex-grow flex items-start justify-center pt-20">

        <div className="relative z-10 w-full max-w-md bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-8">
          <ToastContainer />
          <div className="text-center mb-6">
            {/* <img
              src="/images/Car.png"
              alt="CarFixParts Logo"
              className="mx-auto w-16 mb-3"
            /> */}
            <h1 className="text-3xl font-extrabold tracking-wide text-primary">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Sign in to continue to CarFixParts
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none text-white placeholder-gray-500"
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark transition-all duration-300 font-semibold text-white shadow-lg disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>      </div>
    </div>
  );
};

export default Login;