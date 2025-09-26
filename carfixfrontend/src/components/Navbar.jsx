import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white shadow">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="font-bold text-primary">CarFixParts</Link>
        <div className="space-x-4">
          {!user && (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
          {user && user.role === 'admin' && (
            <>
              <Link to="/admin" className="hover:underline">Dashboard</Link>
              <Link to="/admin/pending" className="hover:underline">Pending</Link>
            </>
          )}
          {user && user.role === 'shopkeeper' && (
            <>
              <Link to="/shopkeeper" className="hover:underline">Dashboard</Link>
              <Link to="/shopkeeper/add-part" className="hover:underline">Add Part</Link>
              <Link to="/shopkeeper/my-parts" className="hover:underline">My Parts</Link>
            </>
          )}
          {user && user.role === 'customer' && (
            <Link to="/customer" className="hover:underline">Find Parts</Link>
          )}
          {user && (
            <button onClick={handleLogout} className="px-3 py-1 bg-gray-800 text-white rounded">Logout</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
