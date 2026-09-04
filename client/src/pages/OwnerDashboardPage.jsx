import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { Store, Star, Award, MessageSquare, Mail, MapPin, AlertCircle, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function OwnerDashboardPage() {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchOwnerDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/owner/dashboard');
      if (res.data?.success) {
        setStoreData(res.data.data.store);
      } else {
        setError(res.data?.message || 'Failed to load store dashboard.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching store owner dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerDashboard();
  }, []);

  const rawReviews = useMemo(() => storeData?.ratings || [], [storeData]);

  const sortedReviews = useMemo(() => {
    let list = [...rawReviews];
    list.sort((a, b) => {
      let valA, valB;
      if (sortField === 'name') {
        valA = (a.user?.name || '').toLowerCase();
        valB = (b.user?.name || '').toLowerCase();
      } else if (sortField === 'email') {
        valA = (a.user?.email || '').toLowerCase();
        valB = (b.user?.email || '').toLowerCase();
      } else if (sortField === 'rating') {
        valA = Number(a.rating || 0);
        valB = Number(b.rating || 0);
      } else {
        valA = new Date(a.updatedAt || a.createdAt).getTime();
        valB = new Date(b.updatedAt || b.createdAt).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [rawReviews, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={13} style={{ opacity: 0.35, marginLeft: 4, verticalAlign: 'middle' }} />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={13} style={{ color: 'var(--brand-forest)', marginLeft: 4, verticalAlign: 'middle' }} />
    ) : (
      <ArrowDown size={13} style={{ color: 'var(--brand-forest)', marginLeft: 4, verticalAlign: 'middle' }} />
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? 'var(--accent-gold-stars)' : 'none'}
        color={i < rating ? 'var(--accent-gold-stars)' : '#D1D5DB'}
        strokeWidth={1.5}
      />
    ));
  };

  if (loading) {
    return (
      <div className="main-container">
        <div className="empty-state-box">
          <Store size={44} className="empty-state-icon" style={{ animation: 'pulse 1.5s infinite' }} />
          <h3 className="empty-state-title">Loading Store Dashboard...</h3>
        </div>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="main-container">
        <div className="empty-state-box">
          <AlertCircle size={44} color="var(--accent-gold)" className="empty-state-icon" />
          <h3 className="empty-state-title">No Store Assigned Yet</h3>
          <p style={{ maxWidth: 500, margin: '0 auto' }}>
            {error || 'Your account is registered as a Store Owner, but the System Administrator has not assigned a bookstore to your profile yet.'}
          </p>
          <button onClick={fetchOwnerDashboard} className="btn-search" style={{ margin: '20px auto 0' }}>
            Check Again
          </button>
        </div>
      </div>
    );
  }

  const avgRating = Number(storeData.averageRating || 0);
  const totalRatings = storeData.totalRatings || 0;

  return (
    <div className="main-container">
      {/* Store Header Banner */}
      <div className="dashboard-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--tag-forest-bg)', color: 'var(--tag-forest-text)', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
              <Award size={14} />
              <span>Verified Store Proprietor</span>
            </div>
            <h1 className="dashboard-title">{storeData.name}</h1>
            <div style={{ display: 'flex', gap: 18, color: 'var(--text-secondary)', fontSize: 14, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Mail size={15} color="var(--text-muted)" />
                {storeData.email}
              </span>
              {storeData.address && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={15} color="var(--text-muted)" />
                  {storeData.address}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={fetchOwnerDashboard}
            className="btn-signin"
            style={{ border: '1px solid var(--border-card)' }}
          >
            <RefreshCw size={14} style={{ display: 'inline', marginRight: 6 }} />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card gold">
          <div className="stat-title">Average Store Rating</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div className="stat-value">{avgRating > 0 ? avgRating.toFixed(1) : 'New'}</div>
            <div style={{ display: 'flex', color: 'var(--accent-gold-stars)' }}>
              {renderStars(Math.round(avgRating))}
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Based on {totalRatings} customer rating submissions
          </p>
        </div>

        <div className="stat-card espresso">
          <div className="stat-title">Total Customer Reviews</div>
          <div className="stat-value">{totalRatings}</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Community reader reviews recorded
          </p>
        </div>
      </div>

      {/* Reviews Table / Feed */}
      <div className="data-table-card">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={18} color="var(--brand-forest)" />
            <h3 className="table-title">Customer Ratings &amp; Reader Reviews</h3>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Showing {sortedReviews.length} ratings (click headers to sort)
          </span>
        </div>

        <div className="table-wrapper">
          <table className="editorial-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Customer Name {renderSortIndicator('name')}
                </th>
                <th onClick={() => handleSort('email')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Customer Email {renderSortIndicator('email')}
                </th>
                <th onClick={() => handleSort('rating')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Star Rating {renderSortIndicator('rating')}
                </th>
                <th onClick={() => handleSort('updatedAt')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Reviewed Date {renderSortIndicator('updatedAt')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedReviews.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No customer ratings submitted for this bookstore yet.
                  </td>
                </tr>
              ) : (
                sortedReviews.map((rev) => (
                  <tr key={rev.ratingId || rev.id}>
                    <td style={{ fontWeight: 600 }}>{rev.user?.name || 'Anonymous Reader'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{rev.user?.email || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ display: 'flex' }}>{renderStars(rev.rating)}</div>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{rev.rating} / 5</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      {new Date(rev.updatedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
