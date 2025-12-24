import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center space-x-2 text-2xl font-extrabold tracking-wide text-primary hover:text-primary-light transition-colors"
        >
          <img src="/images/Car.png" alt="CarFixParts" className="w-8 h-8" style={{width : 250 ,height : 70, marginLeft: -60}} />
  
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {!user && (
            <>
              <Link to="/login" className="hover:text-primary transition-colors">
                Login
              </Link>
              <Link to="/register" className="hover:text-primary transition-colors">
                Register
              </Link>
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              <Link to="/admin" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/admin/pending" className="hover:text-primary transition-colors">
                Pending
              </Link>
            </>
          )}

          {user && user.role === 'shopkeeper' && (
            <>
              <Link to="/shopkeeper" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/shopkeeper/add-part" className="hover:text-primary transition-colors">
                Add Part
              </Link>
              <Link to="/shopkeeper/my-parts" className="hover:text-primary transition-colors">
                My Parts
              </Link>
            </>
          )}

          {user && user.role === 'customer' && (
            <Link to="/customer" className="hover:text-primary transition-colors">
              Find Parts
            </Link>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-md font-semibold transition-all duration-300"
            >
              Logout
            </button>
          )}
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden text-2xl focus:outline-none hover:text-primary transition-colors"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col items-center space-y-3 py-4">
            {!user && (
              <>
                <Link to="/login" onClick={toggleMenu} className="hover:text-primary">
                  Login
                </Link>
                <Link to="/register" onClick={toggleMenu} className="hover:text-primary">
                  Register
                </Link>
              </>
            )}

            {user && user.role === 'admin' && (
              <>
                <Link to="/admin" onClick={toggleMenu} className="hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/admin/pending" onClick={toggleMenu} className="hover:text-primary">
                  Pending
                </Link>
              </>
            )}

            {user && user.role === 'shopkeeper' && (
              <>
                <Link to="/shopkeeper" onClick={toggleMenu} className="hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/shopkeeper/add-part" onClick={toggleMenu} className="hover:text-primary">
                  Add Part
                </Link>
                <Link to="/shopkeeper/my-parts" onClick={toggleMenu} className="hover:text-primary">
                  My Parts
                </Link>
              </>
            )}

            {user && user.role === 'customer' && (
              <Link to="/customer" onClick={toggleMenu} className="hover:text-primary">
                Find Parts
              </Link>
            )}

            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-md font-semibold transition-all duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;