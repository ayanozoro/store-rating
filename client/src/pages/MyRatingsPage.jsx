import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Star, MapPin, Trash2, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyRatingsPage() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyRatings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/ratings/my');
      if (res.data?.success) {
        setRatings(res.data.data.ratings || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your rating ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRatings();
  }, []);

  const handleDeleteRating = async (storeId) => {
    if (!window.confirm('Are you sure you want to remove your rating for this bookstore?')) return;

    try {
      const res = await api.delete(`/ratings/${storeId}`);
      if (res.data?.success) {
        setRatings(ratings.filter((r) => r.storeId !== storeId && r.store?.id !== storeId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete rating.');
    }
  };

  const renderStars = (score) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < score ? 'var(--accent-gold-stars)' : 'none'}
        color={i < score ? 'var(--accent-gold-stars)' : '#D1D5DB'}
        strokeWidth={1.5}
      />
    ));
  };

  return (
    <div className="main-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Rating Ledger</h1>
        <p className="dashboard-subtitle">
          Your personal record of reviewed bookshops, literary cafes, and community stores.
        </p>
      </div>

      {loading ? (
        <div className="empty-state-box">
          <BookOpen size={44} className="empty-state-icon" style={{ animation: 'pulse 1.5s infinite' }} />
          <h3 className="empty-state-title">Loading Your Reviews...</h3>
        </div>
      ) : ratings.length === 0 ? (
        <div className="empty-state-box">
          <BookOpen size={44} className="empty-state-icon" />
          <h3 className="empty-state-title">No Store Ratings Yet</h3>
          <p>You haven't recorded any ratings for local bookstores yet.</p>
          <Link to="/" className="btn-search" style={{ display: 'inline-flex', margin: '20px auto 0' }}>
            Explore Bookstores &amp; Rate
          </Link>
        </div>
      ) : (
        <div className="data-table-card">
          <div className="table-toolbar">
            <h3 className="table-title">Your Submitted Reviews ({ratings.length})</h3>
            <button
              onClick={fetchMyRatings}
              className="btn-signin"
              style={{ border: '1px solid var(--border-card)' }}
            >
              <RefreshCw size={14} style={{ display: 'inline', marginRight: 6 }} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="table-wrapper">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Bookstore Name</th>
                  <th>Location</th>
                  <th>Your Star Rating</th>
                  <th>Submitted Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((item) => {
                  const store = item.store;
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700 }}>
                        <Link to="/" style={{ color: 'var(--brand-forest)' }}>
                          {store?.name || 'Unknown Store'}
                        </Link>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={13} color="var(--text-muted)" />
                          {store?.address || '—'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ display: 'flex' }}>{renderStars(item.rating)}</div>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{item.rating} / 5</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                        {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteRating(store?.id || item.storeId)}
                          className="btn-logout"
                          style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                          title="Remove Rating"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
