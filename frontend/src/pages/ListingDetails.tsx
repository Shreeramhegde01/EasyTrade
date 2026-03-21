import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListing, startChat, Listing, formatPrice, timeAgo, isLoggedIn, getCurrentUser } from '../services/authService';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getListing(parseInt(id))
        .then((res) => setListing(res.data))
        .catch(() => navigate('/'))
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const handleChat = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    try {
      const res = await startChat(listing!.id);
      navigate(`/chat?chatId=${res.data.id}`);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Could not start chat');
    }
  };

  if (loading) return <div className="main-content"><div className="spinner" /></div>;
  if (!listing) return <div className="main-content"><div className="empty-state"><h3>Listing not found</h3></div></div>;

  const currentUser = getCurrentUser();
  const isOwner = currentUser?.id === listing.user.id;
  const placeholderImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.title)}&size=600&background=6c5ce7&color=fff&font-size=0.25`;

  return (
    <div className="main-content">
      <div className="container fade-in">
        <div className="detail-container">
          {/* Left: Image + Description */}
          <div>
            <div className="detail-image-container">
              <img
                className="detail-image"
                src={(listing.imageUrl && listing.imageUrl.trim() !== '') ? listing.imageUrl : placeholderImg}
                alt={listing.title}
                onError={(e) => { (e.target as HTMLImageElement).src = placeholderImg; }}
              />
            </div>
            <div className="detail-card" style={{ marginTop: '1rem' }}>
              <h2 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Description</h2>
              <p className="detail-description">{listing.description}</p>
            </div>
          </div>

          {/* Right: Info Panel */}
          <div className="detail-info">
            <div className="detail-card">
              <div className="detail-price">{formatPrice(listing.price)}</div>
              <div className="detail-title">{listing.title}</div>
              <div className="detail-meta">
                <div className="detail-meta-item">📍 {listing.location}</div>
                <div className="detail-meta-item">🏷️ {listing.category}</div>
                <div className="detail-meta-item">🕐 {timeAgo(listing.createdAt)}</div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="seller-card" style={{ marginBottom: '1rem' }}>
              <div className="seller-avatar">
                {listing.user.name.charAt(0)}
              </div>
              <div className="seller-info">
                <h3>{listing.user.name}</h3>
                <p>Member since {new Date(listing.user.createdAt || '').toLocaleDateString()}</p>
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwner && (
              <button
                className="btn btn-primary btn-full"
                onClick={handleChat}
                id="chat-with-seller-btn"
                style={{ fontSize: '1rem', padding: '14px' }}
              >
                💬 Chat with Seller
              </button>
            )}

            {isOwner && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => navigate(`/edit/${listing.id}`)}
                  id="edit-listing-btn"
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-danger"
                  style={{ flex: 1 }}
                  onClick={() => navigate('/my-listings')}
                  id="manage-listing-btn"
                >
                  Manage
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
