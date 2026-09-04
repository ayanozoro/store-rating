import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nameLengthValid = formData.name.length >= 20 && formData.name.length <= 60;
  const passwordHasUpper = /[A-Z]/.test(formData.password);
  const passwordHasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const passwordLengthValid = formData.password.length >= 8 && formData.password.length <= 16;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameLengthValid) {
      setError('Full Name must be between 20 and 60 characters.');
      return;
    }
    if (!passwordLengthValid || !passwordHasUpper || !passwordHasSpecial) {
      setError('Password must be 8-16 characters and include at least 1 uppercase letter and 1 special character.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Logo size="large" />
          </div>
          <h2>Join The Community</h2>
          <p>Create your personal reader profile to rate local bookshops and discover hidden literary havens.</p>
        </div>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={16} style={{ display: 'inline', marginRight: 6 }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">
              Full Name (20–60 characters)
              <span style={{ float: 'right', fontSize: 11, color: nameLengthValid ? 'var(--brand-forest)' : 'var(--text-muted)' }}>
                {formData.name.length}/60 chars
              </span>
            </label>
            <input
              type="text"
              name="name"
              required
              className="form-input"
              placeholder="e.g. Arthur Conan Doyle Senior Fellow"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="form-input"
              placeholder="reader@bookclub.org"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              required
              className="form-input"
              placeholder="8-16 chars, 1 uppercase, 1 symbol (e.g. BookLover@2026)"
              value={formData.password}
              onChange={handleChange}
            />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Must contain 8–16 chars, 1 uppercase letter, and 1 special symbol.
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">Physical Address (Optional, max 400 chars)</label>
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="221B Baker Street, London"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-auth-submit"
          >
            {loading ? 'Creating Member Profile...' : 'Complete Registration'}
          </button>
        </form>

        <div className="auth-footer">
          Already a member of the ledger? <Link to="/login">Sign In here</Link>
        </div>
      </div>
    </div>
  );
}
