import React, { useState } from 'react';
import { Star, MapPin, Award, BookOpen, Quote, Heart, Bookmark, Sparkles } from 'lucide-react';

// Curated high-resolution aesthetic bookstore & literary cafe photography
const CURATED_IMAGES = [
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507842229447-3a137b019313?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80'
];

const CURATED_QUOTES = [
  '“A tranquil haven for timeless classics, rare vintage prints, and artisanal pressings.”',
  '“Warm wooden shelving, rich espresso aromas, and curated staff recommendations.”',
  '“Independent neighborhood sanctuary celebrating poetry, rare paperbacks, and quiet study.”',
  '“Beloved community anchor hosting monthly author salons and literary discussions.”'
];

export default function StoreCard({ store, index = 0, onRate, user }) {
  const [isSaved, setIsSaved] = useState(false);

  // Deterministic photo & quote based on store ID or index
  const imageIndex = (store.name?.length || index) % CURATED_IMAGES.length;
  const quoteIndex = (store.address?.length || index) % CURATED_QUOTES.length;
  const imageUrl = CURATED_IMAGES[imageIndex];
  const quoteText = CURATED_QUOTES[quoteIndex];

  const avgRating = Number(store.averageRating || 0);
  const totalRatings = store.totalRatings || 0;
  const myRating = store.myRating;

  return (
    <article className="airbnb-store-card">
      {/* Visual Image Box with Airbnb-style badges and Bookmark button */}
      <div className="card-media-wrapper">
        <img
          src={imageUrl}
          alt={store.name}
          className="card-media-img"
          loading="lazy"
        />

        {/* Top-Left: Staff Curator Badge */}
        <div className="card-top-left-badges">
          {avgRating >= 4.7 ? (
            <span className="badge-curator-pick">
              <Sparkles size={11} />
              <span>Curator's Pick</span>
            </span>
          ) : (
            <span className="badge-editorial-category">
              <BookOpen size={11} />
              <span>Boutique Bookshop</span>
            </span>
          )}
        </div>

        {/* Top-Right: Airbnb-Style Save Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          className={`btn-save-listing ${isSaved ? 'saved' : ''}`}
          title={isSaved ? 'Saved to reading wish list' : 'Save to wish list'}
        >
          <Heart
            size={17}
            fill={isSaved ? '#E11D48' : 'rgba(0, 0, 0, 0.4)'}
            color={isSaved ? '#E11D48' : '#FFFFFF'}
            strokeWidth={2}
          />
        </button>

        {/* Carousel Dots indicator */}
        <div className="card-carousel-dots">
          <span className="dot active" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>

      {/* Card Details (Airbnb Typography + Editorial Literary Vibe) */}
      <div className="card-info-content">
        {/* Row 1: Title and Airbnb-style Star Score */}
        <div className="card-title-row">
          <h3 className="card-store-title" title={store.name}>
            {store.name}
          </h3>
          <div className="card-rating-badge">
            <Star size={14} fill="var(--accent-gold-stars)" color="var(--accent-gold-stars)" />
            <span className="rating-score-bold">
              {avgRating > 0 ? avgRating.toFixed(1) : 'New'}
            </span>
            {totalRatings > 0 && (
              <span className="rating-count-muted">({totalRatings})</span>
            )}
          </div>
        </div>

        {/* Row 2: Location Address */}
        <div className="card-location-row">
          <MapPin size={13} className="location-pin" />
          <span className="location-text">{store.address || 'Central Literary District'}</span>
        </div>

        {/* Row 3: Kinfolk Editorial Quote Box */}
        <div className="card-quote-snippet">
          <Quote size={11} className="quote-icon" />
          <p className="quote-text">{quoteText}</p>
        </div>

        {/* Row 4: My Submitted Rating Pill if rated */}
        {myRating && (
          <div className="my-rating-status-pill">
            <Star size={12} fill="currentColor" />
            <span>Your rating: {myRating} ★</span>
          </div>
        )}

        {/* Row 5: Action Button (Rate Store) */}
        <div className="card-action-bar">
          <button
            type="button"
            onClick={() => onRate(store)}
            className={`btn-airbnb-rate ${myRating ? 'has-rated' : ''}`}
          >
            <Star size={15} />
            <span>{myRating ? `Update Your Rating (${myRating} ★)` : 'Rate Store'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
