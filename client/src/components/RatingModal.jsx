import React, { useState } from 'react';
import { Star, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RATING_HINTS = {
  1: '1 Star — Needs Improvement',
  2: '2 Stars — Fair Selection',
  3: '3 Stars — Good Neighborhood Store',
  4: '4 Stars — Highly Recommended Haven',
  5: '5 Stars — Exceptional Literary Sanctuary ★★★★★'
};

export default function RatingModal({ store, onClose, onSuccess }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(store?.myRating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!store) return null;

  const currentDisplayRating = hoverRating || rating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (user.role !== 'NORMAL_USER') {
      setError('Only community readers and customers (Normal Users) can submit ratings.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/ratings', {
        storeId: store.id,
        rating: Number(rating),
      });

      if (res.data?.success) {
        setSubmitted(true);
        setTimeout(() => {
          onSuccess && onSuccess(store.id, Number(rating));
          onClose();
        }, 1200);
      } else {
        setError(res.data?.message || 'Failed to submit rating.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while submitting your rating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="rating-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-header-title">Rate Store &amp; Leave Review</h3>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Store snippet */}
          <div className="modal-store-snippet">
            <div className="modal-store-info">
              <h4>{store.name}</h4>
              <p>{store.address || 'Curated Bookshop'}</p>
            </div>
          </div>

          {/* Success state */}
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              <CheckCircle size={48} color="var(--brand-forest)" style={{ marginBottom: 12 }} />
              <h4 style={{ fontSize: 20, marginBottom: 6 }}>Rating Recorded</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Thank you for contributing to the community ledger!
              </p>
            </div>
          ) : !user ? (
            /* Guest Warning */
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <AlertCircle size={40} color="var(--accent-gold)" style={{ marginBottom: 12 }} />
              <h4 style={{ fontSize: 18, marginBottom: 8 }}>Sign In to Rate</h4>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
                You must be logged in as a community member to record your star rating for this store.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <Link to="/login" className="btn-signin" onClick={onClose} style={{ border: '1px solid var(--border-card)' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn-register" onClick={onClose}>
                  Register Free
                </Link>
              </div>
            </div>
          ) : (
            /* Rating Form */
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="auth-alert error">
                  {error}
                </div>
              )}

              <div className="star-selector-box">
                <div className="star-selector-label">Select Your Rating:</div>
                <div className="stars-interactive-row">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isFilled = starValue <= currentDisplayRating;
                    return (
                      <button
                        key={starValue}
                        type="button"
                        className="star-interactive-btn"
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starValue)}
                      >
                        <Star
                          size={36}
                          fill={isFilled ? 'var(--accent-gold-stars)' : 'none'}
                          color={isFilled ? 'var(--accent-gold-stars)' : '#D1D5DB'}
                          strokeWidth={isFilled ? 1 : 1.5}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="star-rating-hint">
                  {RATING_HINTS[currentDisplayRating]}
                </div>
              </div>

              <div className="modal-footer" style={{ margin: '0 -24px -24px', padding: '16px 24px' }}>
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-submit-rating"
                >
                  {loading ? 'Recording...' : store.myRating ? 'Update Rating' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
