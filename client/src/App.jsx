import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import MyRatingsPage from './pages/MyRatingsPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />

          <div style={{ flex: 1 }}>
            <Routes>
              {/* Public Discovery Page */}
              <Route path="/" element={<HomePage />} />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* User Ratings History */}
              <Route
                path="/my-ratings"
                element={
                  <ProtectedRoute allowedRoles={['NORMAL_USER', 'SYSTEM_ADMIN', 'STORE_OWNER']}>
                    <MyRatingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Console */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Store Owner Dashboard */}
              <Route
                path="/owner"
                element={
                  <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                    <OwnerDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Editorial Footer */}
          <footer style={{
            background: 'var(--bg-surface-elevated)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '24px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--text-muted)'
          }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: 'var(--text-espresso)', marginBottom: '4px' }}>
              The Ledger · Curated Literary Havens &amp; Independent Bookshops
            </p>
            <p>
              Dedicated to celebrating neighborhood bookstores, independent printmakers, and quiet reading sanctuaries.
            </p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
