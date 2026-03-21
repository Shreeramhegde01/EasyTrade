import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchListings, Listing } from '../services/authService';
import ListingCard from '../components/ListingCard';

export default function SearchResults() {
  const [params] = useSearchParams();
  const keyword = params.get('keyword') || '';
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (keyword) {
      setLoading(true);
      searchListings(keyword)
        .then((res) => setListings(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [keyword]);

  return (
    <div className="main-content">
      <div className="container fade-in">
        <div className="page-header" style={{ padding: '2rem 0 1rem' }}>
          <h1>Search Results</h1>
          <p>Showing results for "{keyword}" • {listings.length} items found</p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No results found</h3>
            <p>Try different keywords or browse categories</p>
          </div>
        ) : (
          <div className="listing-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
