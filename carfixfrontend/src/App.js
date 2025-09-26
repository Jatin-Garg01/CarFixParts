import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingShopkeepers from './pages/admin/PendingShopkeepers';
import ShopkeeperDashboard from './pages/shopkeeper/ShopkeeperDashboard';
import AddPart from './pages/shopkeeper/AddPart';
import MyParts from './pages/shopkeeper/MyParts';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import AdminShopkeeper from './pages/admin/AdminShopkeeper';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}> 
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/pending" element={<PendingShopkeepers />} />
            <Route path="/admin/shopkeeper/:id" element={<AdminShopkeeper />} />
          </Route>

          {/* Shopkeeper */}
          <Route element={<ProtectedRoute allowedRoles={["shopkeeper"]} />}> 
            <Route path="/shopkeeper" element={<ShopkeeperDashboard />} />
            <Route path="/shopkeeper/add-part" element={<AddPart />} />
            <Route path="/shopkeeper/my-parts" element={<MyParts />} />
          </Route>

          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
