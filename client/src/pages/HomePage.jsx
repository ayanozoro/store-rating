import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StoreCard from '../components/StoreCard';
import RatingModal from '../components/RatingModal';
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  Sparkles,
  RefreshCw,
  Coffee,
  Bookmark,
  Feather,
  Compass,
  Building2,
  Check
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = [
  { id: 'All Stores', label: 'All Havens', icon: BookOpen },
  { id: 'Independent Bookstores', label: 'Indie Shops', icon: Compass },
  { id: 'Literary Cafés', label: 'Coffee & Books', icon: Coffee },
  { id: 'Rare & Vintage Prints', label: 'Rare & Vintage', icon: Building2 },
  { id: 'Poetry Havens', label: 'Poetry & Salons', icon: Feather },
  { id: 'Curator Picks', label: "Curator's Choice", icon: Sparkles },
];

export default function HomePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Stores');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') === 'rating' ? 'rating' : 'createdAt');
  const [ratingStore, setRatingStore] = useState(null);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 50,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      if (selectedSort === 'rating') {
        params.sortBy = 'rating';
        params.order = 'desc';
      } else if (selectedSort === 'name') {
        params.sortBy = 'name';
        params.order = 'asc';
      } else {
        params.sortBy = 'createdAt';
        params.order = 'desc';
      }

      const res = await api.get('/stores', { params });
      if (res.data?.success) {
        const storeList = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.stores || []);
        setStores(storeList);
      }
    } catch (err) {
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [selectedSort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleRatingSuccess = (storeId, newRating) => {
    // Optimistically update the store's rating in local list
    setStores((prevStores) =>
      prevStores.map((s) => {
        if (s.id === storeId) {
          const wasRated = s.myRating !== undefined && s.myRating !== null;
          const oldTotal = s.totalRatings || 0;
          const newTotal = wasRated ? oldTotal : oldTotal + 1;
          return {
            ...s,
            myRating: newRating,
            totalRatings: newTotal,
          };
        }
        return s;
      })
    );
  };

  // Filter stores by category if curator picks is selected
  const filteredStores = stores.filter((store) => {
    if (selectedCategory === 'Curator Picks') {
      return Number(store.averageRating || 0) >= 4.7;
    }
    return true;
  });

  return (
    <main className="airbnb-home-layout">
      {/* Search Header Bar (Airbnb Capsule Search) */}
      <section className="airbnb-hero-container">
        <div className="hero-editorial-badge">
          <Sparkles size={13} />
          <span>The Curated Index · 2026 Edition</span>
        </div>

        <h1 className="hero-editorial-headline">
          Discover Exceptional Bookstore Havens
        </h1>
        <p className="hero-editorial-subtext">
          Explore neighborhood paperbacks, historic print salons, and quiet coffee sanctuaries.
        </p>

        {/* Floating Segmented Airbnb-Style Search Capsule */}
        <form className="airbnb-search-capsule" onSubmit={handleSearchSubmit}>
          {/* Segment 1: Search Query */}
          <div className="capsule-segment search-segment">
            <span className="segment-label">Location / Bookstore</span>
            <input
              type="text"
              className="segment-input"
              placeholder="Search by name, city, or street..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="capsule-divider" />

          {/* Segment 2: Curation Category */}
          <div className="capsule-segment select-segment">
            <span className="segment-label">Vibe &amp; Style</span>
            <select
              className="segment-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="capsule-divider" />

          {/* Segment 3: Sort Selection */}
          <div className="capsule-segment select-segment">
            <span className="segment-label">Sort Ledger</span>
            <select
              className="segment-select"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              <option value="rating">Highest Rated ★</option>
              <option value="createdAt">Newly Added</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>
          </div>

          {/* Big Circular Search Action Button */}
          <button type="submit" className="capsule-search-btn" title="Search Bookstores">
            <Search size={18} />
            <span className="search-btn-text">Search</span>
          </button>
        </form>

        {/* Airbnb-Style Category Strip with Icons */}
        <div className="airbnb-category-strip-wrapper">
          <div className="airbnb-category-strip">
            {CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`airbnb-cat-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <IconComponent size={18} className="cat-icon" />
                  <span className="cat-label">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Listing Section */}
      <div className="airbnb-listings-container">
        {/* Results Bar */}
        <div className="listings-toolbar">
          <div className="listings-headline-group">
            <h2 className="listings-section-title">
              {selectedCategory === 'All Stores' ? 'Curated Bookshops & Salons' : selectedCategory}
            </h2>
            <span className="listings-count-pill">
              {filteredStores.length} {filteredStores.length === 1 ? 'storefront' : 'establishments available'}
            </span>
          </div>

          <button
            onClick={fetchStores}
            className="btn-airbnb-refresh"
            title="Refresh Directory"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="airbnb-empty-box">
            <BookOpen size={44} className="empty-icon animate-pulse" />
            <h3 className="empty-title">Curating Bookstore Ledger...</h3>
            <p className="empty-desc">Fetching the latest community star ratings.</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="airbnb-empty-box">
            <BookOpen size={48} className="empty-icon" />
            <h3 className="empty-title">No Bookstores Found</h3>
            <p className="empty-desc">
              We couldn't find any bookstores matching "{searchQuery}". Try searching a different city or street.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Stores');
                fetchStores();
              }}
              className="btn-capsule-reset"
            >
              Clear Search Filters
            </button>
          </div>
        ) : (
          <div className="airbnb-cards-grid">
            {filteredStores.map((store, index) => (
              <StoreCard
                key={store.id}
                store={store}
                index={index}
                user={user}
                onRate={(selectedStore) => setRatingStore(selectedStore)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {ratingStore && (
        <RatingModal
          store={ratingStore}
          onClose={() => setRatingStore(null)}
          onSuccess={handleRatingSuccess}
        />
      )}
    </main>
  );
}
