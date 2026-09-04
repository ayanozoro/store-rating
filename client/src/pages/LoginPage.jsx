import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { BookOpen, KeyRound, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'SYSTEM_ADMIN') {
        navigate('/admin');
      } else if (result.user.role === 'STORE_OWNER') {
        navigate('/owner');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message || 'Invalid email or password.');
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Logo size="large" />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your community ledger account to rate stores and manage reviews.</p>
        </div>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={16} style={{ display: 'inline', marginRight: 6 }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-auth-submit"
          >
            {loading ? 'Authenticating...' : 'Sign In to The Ledger'}
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Quick Demo Accounts:
          </span>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('admin@storerating.com', 'Admin@12345')}
              className="stat-chip"
              style={{ background: '#FEF3C7', color: '#92400E', cursor: 'pointer' }}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('owner1@storerating.com', 'Owner@12345')}
              className="stat-chip"
              style={{ background: '#E0E7FF', color: '#3730A3', cursor: 'pointer' }}
            >
              Store Owner
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('user1@storerating.com', 'User@12345')}
              className="stat-chip"
              style={{ background: 'var(--brand-forest-light)', color: 'var(--brand-forest)', cursor: 'pointer' }}
            >
              Reader (User)
            </button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account yet? <Link to="/register">Join the Community</Link>
        </div>
      </div>
    </div>
  );
}
