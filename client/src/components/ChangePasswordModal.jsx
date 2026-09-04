import React, { useState } from 'react';
import api from '../services/api';
import { KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordModal({ onClose }) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const newPasswordHasUpper = /[A-Z]/.test(formData.newPassword);
  const newPasswordHasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);
  const newPasswordLengthValid = formData.newPassword.length >= 8 && formData.newPassword.length <= 16;
  const passwordsMatch = formData.newPassword && formData.newPassword === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!newPasswordLengthValid || !newPasswordHasUpper || !newPasswordHasSpecial) {
      setError('New password must be 8-16 characters and include at least 1 uppercase letter and 1 special character.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (res.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        const errorData = res.data?.data;
        setError(Array.isArray(errorData) ? errorData.join(' • ') : (res.data?.message || 'Failed to update password.'));
      }
    } catch (err) {
      const errorData = err.response?.data?.data;
      setError(Array.isArray(errorData) ? errorData.join(' • ') : (err.response?.data?.message || 'Failed to update password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="rating-modal-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-full)',
              background: 'var(--tag-forest-bg)',
              color: 'var(--tag-forest-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <KeyRound size={18} />
            </div>
            <div>
              <h3 className="modal-header-title">Update Password</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                Maintain your account security with a strong password.
              </p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {success ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle2 size={44} color="var(--brand-forest)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, margin: '0 0 6px' }}>Password Updated!</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Your credentials have been securely updated in the ledger.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="auth-alert error" style={{ marginBottom: 16 }}>
                  <AlertCircle size={16} style={{ display: 'inline', marginRight: 6 }} />
                  {error}
                </div>
              )}

              {/* Current Password */}
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showOld ? 'text' : 'password'}
                    name="oldPassword"
                    required
                    className="form-input"
                    placeholder="Enter existing password"
                    value={formData.oldPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="form-group">
                <label className="form-label">
                  New Password
                  <span style={{ float: 'right', fontSize: 11, color: newPasswordLengthValid && newPasswordHasUpper && newPasswordHasSpecial ? 'var(--brand-forest)' : 'var(--text-muted)' }}>
                    8–16 chars, 1 upper, 1 special
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNew ? 'text' : 'password'}
                    name="newPassword"
                    required
                    className="form-input"
                    placeholder="e.g. NewPassword@2026"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="form-group">
                <label className="form-label">
                  Confirm New Password
                  {formData.confirmPassword && (
                    <span style={{ float: 'right', fontSize: 11, color: passwordsMatch ? 'var(--brand-forest)' : '#EF4444' }}>
                      {passwordsMatch ? 'Passwords match ✓' : 'Passwords do not match ✕'}
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="form-input"
                  placeholder="Re-enter new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-signin"
                  style={{ flex: 1, border: '1px solid var(--border-card)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-auth-submit"
                  style={{ flex: 2, marginTop: 0 }}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
