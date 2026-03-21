import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getMyListings, updateProfile, User, Listing, formatPrice } from '../services/authService';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getProfile(), getMyListings()])
      .then(([profileRes, listingsRes]) => {
        setUser(profileRes.data);
        setListings(listingsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const startEditing = () => {
    if (user) {
      setEditForm({ name: user.name, email: user.email, phone: user.phone || '', password: '' });
      setEditing(true);
      setMessage('');
      setError('');
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const updateData: { name?: string; email?: string; phone?: string; password?: string } = {};
      if (editForm.name !== user?.name) updateData.name = editForm.name;
      if (editForm.email !== user?.email) updateData.email = editForm.email;
      if (editForm.phone !== (user?.phone || '')) updateData.phone = editForm.phone;
      if (editForm.password) updateData.password = editForm.password;

      const res = await updateProfile(updateData);
      setUser(res.data);
      // Update localStorage with new user info
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.name = res.data.name;
        parsed.email = res.data.email;
        localStorage.setItem('user', JSON.stringify(parsed));
      }
      setEditing(false);
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="main-content"><div className="spinner" /></div>;
  if (!user) return <div className="main-content"><div className="empty-state"><h3>Could not load profile</h3></div></div>;

  return (
    <div className="main-content">
      <div className="profile-container fade-in">
        <div className="profile-header">
          <div className="profile-avatar">{user.name.charAt(0)}</div>
          <div className="profile-details">
            {!editing ? (
              <>
                <h1>{user.name}</h1>
                <p>{user.email}</p>
                <div className="profile-meta">
                  {user.phone && <span>📱 {user.phone}</span>}
                  <span>📦 {listings.length} listings</span>
                  {user.createdAt && <span>📅 Joined {new Date(user.createdAt).toLocaleDateString()}</span>}
                </div>
                <button className="btn btn-secondary btn-sm" onClick={startEditing} style={{ marginTop: '0.75rem' }} id="edit-profile-btn">
                  ✏️ Edit Profile
                </button>
              </>
            ) : (
              <div style={{ width: '100%' }}>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Name</label>
                  <input name="name" className="form-control" value={editForm.name} onChange={handleEditChange} id="edit-profile-name" />
                </div>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Email</label>
                  <input name="email" type="email" className="form-control" value={editForm.email} onChange={handleEditChange} id="edit-profile-email" />
                </div>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Phone</label>
                  <input name="phone" type="tel" className="form-control" value={editForm.phone} onChange={handleEditChange} id="edit-profile-phone" />
                </div>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>New Password (leave blank to keep current)</label>
                  <input name="password" type="password" className="form-control" placeholder="••••••" value={editForm.password} onChange={handleEditChange} id="edit-profile-password" />
                </div>
                {error && <div className="error-message" style={{ marginBottom: '0.5rem' }}>{error}</div>}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving} id="save-profile-btn">
                    {saving ? 'Saving...' : '💾 Save'}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)} id="cancel-edit-btn">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {message && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.3)', borderRadius: 'var(--radius-sm)', color: '#00c853', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {message}
          </div>
        )}

        <div className="page-header">
          <h1 style={{ fontSize: '1.4rem' }}>My Listings</h1>
        </div>

        {listings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No listings yet</h3>
            <p>
              <Link to="/post" style={{ color: 'var(--accent-secondary)' }}>Post your first ad</Link>
            </p>
          </div>
        ) : (
          <div className="listing-grid">
            {listings.map((listing) => (
              <Link key={listing.id} to={`/listing/${listing.id}`} style={{ textDecoration: 'none' }}>
                <div className="listing-card">
                  <img
                    className="listing-card-image"
                    src={listing.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.title)}&size=400&background=6c5ce7&color=fff`}
                    alt={listing.title}
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.title)}&size=400&background=6c5ce7&color=fff`; }}
                  />
                  <div className="listing-card-body">
                    <div className="listing-card-title">{listing.title}</div>
                    <div className="listing-card-price">{formatPrice(listing.price)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
