import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getListing, updateListing, uploadImage, getCurrentUser } from '../services/authService';

const CATEGORIES = ['Mobiles', 'Laptops', 'Electronics', 'Vehicles', 'Furniture', 'Gaming', 'Fashion', 'Books', 'Other'];

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: '', location: '', imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadListing = async () => {
      try {
        const res = await getListing(parseInt(id));
        const listing = res.data;
        const currentUser = getCurrentUser();
        // Only the owner can edit
        if (!currentUser || listing.user.id !== currentUser.id) {
          navigate(`/listing/${id}`);
          return;
        }
        setForm({
          title: listing.title,
          description: listing.description,
          price: listing.price.toString(),
          category: listing.category,
          location: listing.location,
          imageUrl: listing.imageUrl || '',
        });
        if (listing.imageUrl) {
          setImagePreview(listing.imageUrl);
        }
      } catch {
        setError('Failed to load listing');
      } finally {
        setFetching(false);
      }
    };
    loadListing();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let imageUrl = form.imageUrl;

      // Upload new image to Cloudinary if a file is selected
      if (imageFile) {
        setUploading(true);
        const uploadRes = await uploadImage(imageFile);
        imageUrl = uploadRes.data.url;
        setUploading(false);
      }

      await updateListing(parseInt(id!), {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        location: form.location,
        imageUrl: imageUrl || undefined,
      });
      navigate(`/listing/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update listing.');
      setUploading(false);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="main-content"><div className="spinner" /></div>;

  return (
    <div className="main-content">
      <div className="post-container fade-in">
        <div className="page-header">
          <h1>Edit Listing</h1>
          <p>Update the details of your listing</p>
        </div>

        <div className="post-card">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input name="title" className="form-control" placeholder="e.g. iPhone 14 Pro Max" value={form.title} onChange={handleChange} required id="edit-title" />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" className="form-control" placeholder="Describe your item..." value={form.description} onChange={handleChange} required id="edit-description" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input name="price" type="number" className="form-control" placeholder="45000" value={form.price} onChange={handleChange} required min="0" id="edit-price" />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select name="category" className="form-control" value={form.category} onChange={handleChange} required id="edit-category">
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input name="location" className="form-control" placeholder="e.g. Bangalore" value={form.location} onChange={handleChange} required id="edit-location" />
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleFileChange}
                  id="edit-image"
                  style={{ paddingTop: '0.5rem' }}
                />
              </div>
            </div>

            {imagePreview && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  {imageFile ? 'New image preview:' : 'Current image:'}
                </p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading || uploading} id="edit-submit">
                {uploading ? 'Uploading image...' : loading ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
