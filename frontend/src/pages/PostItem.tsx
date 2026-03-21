import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing, uploadImage } from '../services/authService';

const CATEGORIES = ['Mobiles', 'Laptops', 'Electronics', 'Vehicles', 'Furniture', 'Gaming', 'Fashion', 'Books', 'Other'];

export default function PostItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: '', location: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      let imageUrl: string | undefined;

      // Upload image to Cloudinary if a file is selected
      if (imageFile) {
        setUploading(true);
        const uploadRes = await uploadImage(imageFile);
        imageUrl = uploadRes.data.url;
        setUploading(false);
      }

      await createListing({
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        location: form.location,
        imageUrl: imageUrl,
      });
      navigate('/my-listings');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to post listing.');
      setUploading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="post-container fade-in">
        <div className="page-header">
          <h1>Post Your Ad</h1>
          <p>Fill in the details to list your item</p>
        </div>

        <div className="post-card">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input name="title" className="form-control" placeholder="e.g. iPhone 14 Pro Max" value={form.title} onChange={handleChange} required id="post-title" />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" className="form-control" placeholder="Describe your item, condition, what's included..." value={form.description} onChange={handleChange} required id="post-description" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input name="price" type="number" className="form-control" placeholder="45000" value={form.price} onChange={handleChange} required min="0" id="post-price" />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select name="category" className="form-control" value={form.category} onChange={handleChange} required id="post-category">
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input name="location" className="form-control" placeholder="e.g. Bangalore" value={form.location} onChange={handleChange} required id="post-location" />
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleFileChange}
                  id="post-image"
                  style={{ paddingTop: '0.5rem' }}
                />
              </div>
            </div>

            {imagePreview && (
              <div style={{ marginBottom: '1rem' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading || uploading} id="post-submit" style={{ marginTop: '1rem' }}>
              {uploading ? 'Uploading image...' : loading ? 'Posting...' : '🚀 Post Ad'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
