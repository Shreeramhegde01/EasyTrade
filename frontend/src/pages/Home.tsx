import { useState, useEffect } from 'react';
import { getListings, Listing } from '../services/authService';
import ListingCard from '../components/ListingCard';

const CATEGORIES = ['All', 'Mobiles', 'Laptops', 'Electronics', 'Vehicles', 'Furniture', 'Gaming', 'Fashion', 'Books'];

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    getListings()
      .then((res) => setListings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? listings
    : listings.filter((l) => l.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="main-content">
      <div className="container">
        {/* Hero Section */}
        <div className="page-header" style={{ padding: '2rem 0 1rem' }}>
          <h1>Discover Amazing Deals</h1>
          <p>Buy & sell everything from phones to furniture — all in your city</p>
        </div>

        {/* Category Filter */}
        <div className="category-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              id={`category-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Listings */}
        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>No listings found</h3>
            <p>Try a different category or check back later</p>
          </div>
        ) : (
          <div className="listing-grid">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
