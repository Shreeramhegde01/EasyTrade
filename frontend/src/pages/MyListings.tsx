import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyListings, deleteListing, Listing, formatPrice, timeAgo } from '../services/authService';

export default function MyListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const res = await getMyListings();
      setListings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteListing(id);
      setListings(listings.filter((l) => l.id !== id));
      setToast('Listing deleted successfully');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="main-content"><div className="spinner" /></div>;

  return (
    <div className="main-content">
      <div className="container fade-in">
        <div className="page-header" style={{ padding: '2rem 0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>My Listings</h1>
            <p>{listings.length} active listings</p>
          </div>
          <Link to="/post" className="btn btn-primary" id="new-listing-btn">+ New Listing</Link>
        </div>

        {listings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No listings yet</h3>
            <p>Start selling by posting your first ad</p>
            <Link to="/post" className="btn btn-primary" style={{ marginTop: '1rem' }}>Post Ad</Link>
          </div>
        ) : (
          listings.map((listing) => (
            <div key={listing.id} className="my-listing-item">
              <img
                className="my-listing-image"
                src={listing.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.title)}&size=200&background=6c5ce7&color=fff`}
                alt={listing.title}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.title)}&size=200&background=6c5ce7&color=fff`; }}
              />
              <div className="my-listing-info">
                <h3>
                  <Link to={`/listing/${listing.id}`} style={{ color: 'var(--text-primary)' }}>{listing.title}</Link>
                </h3>
                <div className="price">{formatPrice(listing.price)}</div>
                <div className="meta">📍 {listing.location} • {timeAgo(listing.createdAt)}</div>
              </div>
              <div className="my-listing-actions">
                <Link to={`/listing/${listing.id}`} className="btn btn-secondary btn-sm">View</Link>
                <Link to={`/edit/${listing.id}`} className="btn btn-secondary btn-sm">Edit</Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(listing.id)}
                  id={`delete-listing-${listing.id}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
