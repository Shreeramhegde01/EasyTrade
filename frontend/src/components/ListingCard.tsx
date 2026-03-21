import { useNavigate } from 'react-router-dom';
import { Listing, formatPrice, timeAgo } from '../services/authService';

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const navigate = useNavigate();

  const placeholderImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.title)}&size=400&background=6c5ce7&color=fff&font-size=0.3`;

  const imgSrc = (listing.imageUrl && listing.imageUrl.trim() !== '') ? listing.imageUrl : placeholderImg;

  return (
    <div
      className="listing-card fade-in"
      onClick={() => navigate(`/listing/${listing.id}`)}
      id={`listing-card-${listing.id}`}
    >
      <img
        className="listing-card-image"
        src={imgSrc}
        alt={listing.title}
        onError={(e) => { (e.target as HTMLImageElement).src = placeholderImg; }}
      />
      <div className="listing-card-body">
        <div className="listing-card-title">{listing.title}</div>
        <div className="listing-card-price">{formatPrice(listing.price)}</div>
        <div className="listing-card-meta">
          <span className="listing-card-location">📍 {listing.location}</span>
          <span>{timeAgo(listing.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
