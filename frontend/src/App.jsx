import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components';
import { Dashboard, Search, DocumentViewer, Upload, Login, Register } from './pages';
import { useAuth } from './context/AuthContext';

// Admin component - will be implemented later
const Admin = () => <div>Admin Page</div>;

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      
      {/* Protected Routes with Layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/recent" element={<Dashboard />} />
        <Route path="dashboard/favorites" element={<Dashboard />} />
        <Route path="search" element={<Search />} />
        <Route path="document/:id" element={<DocumentViewer />} />
        <Route path="upload" element={<Upload />} />
        <Route path="admin" element={<Admin />} />
      </Route>
      
      {/* Redirect root to dashboard or login */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;