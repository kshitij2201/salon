import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/UploadGallery.css';

function UploadGallery() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [fileId, setFileId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [galleryItems, setGalleryItems] = useState([]);
  const [uploadType, setUploadType] = useState('image');

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gallery');
      setGalleryItems(response.data);
    } catch (err) {
      setMessage('Failed to fetch gallery items.');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage(`Please select a ${uploadType} to upload.`);
      return;
    }

    if (uploadType === 'image' && !file.type.startsWith('image/')) {
      setMessage('Please upload a valid image file.');
      return;
    }
    if (uploadType === 'video' && !file.type.startsWith('video/')) {
      setMessage('Please upload a valid video file.');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('media', file);
    formData.append('description', description);

    try {
      await axios.post('http://localhost:5000/api/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(`${uploadType === 'image' ? 'Image' : 'Video'} uploaded successfully.`);
      resetForm();
      fetchGalleryItems();
    } catch (err) {
      setMessage(`Failed to upload ${uploadType}.`);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!fileId) {
      setMessage('Please select an item to update.');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    if (file) formData.append('media', file);
    formData.append('description', description);

    try {
      await axios.put(`http://localhost:5000/api/gallery/${fileId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(`${uploadType === 'image' ? 'Image' : 'Video'} updated successfully.`);
      resetForm();
      fetchGalleryItems();
    } catch (err) {
      setMessage(`Failed to update ${uploadType}.`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/gallery/${id}`);
      setMessage('Deleted successfully.');
      fetchGalleryItems();
    } catch (err) {
      setMessage('Failed to delete.');
    }
  };

  const handleEdit = (item) => {
    setFileId(item._id);
    setDescription(item.description);
    setUploadType(isVideo(item.imageUrl) ? 'video' : 'image');
  };

  const isVideo = (url) => {
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  const closeModal = () => {
    setMessage('');
  };

  const resetForm = () => {
    setFile(null);
    setDescription('');
    setFileId(null);
  };

  return (
    <div className="upload-gallery-wrapper">
      <h1>Upload Gallery</h1>

      <div className="upload-form">
        <label>Upload Type:</label>
        <select value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>

        

        <input
          type="file"
          accept={uploadType === 'image' ? 'image/*' : 'video/*'}
          onChange={handleFileChange}
          key={file ? file.name : ''}
        />

        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder={`Enter a description for the ${uploadType}`}
          rows="4"
        />

        <button onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? 'Uploading...' : `Upload ${uploadType}`}
        </button>

        {fileId && (
          <button onClick={handleUpdate} disabled={uploading}>
            {uploading ? 'Updating...' : `Update ${uploadType}`}
          </button>
        )}
      </div>

      {file && (
        <div className="preview">
          <p>Preview:</p>
          {uploadType === 'image' ? (
            <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: '200px', marginTop: '10px' }} />
          ) : (
            <video controls width="250" style={{ marginTop: '10px' }}>
              <source src={URL.createObjectURL(file)} type={file.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      <h2>Gallery</h2>
      <div className="gallery-grid">
        {galleryItems.map((item) => (
          <div key={item._id} className="gallery-card">
            {isVideo(item.imageUrl) ? (
              <video controls className="gallery-image" style={{ height: '200px', objectFit: 'cover' }}>
                <source src={item.imageUrl} />
              </video>
            ) : (
              <img src={item.imageUrl} alt="Gallery" className="gallery-image" />
            )}
            <div className="gallery-content">
              <p className="gallery-description">{item.description}</p>
              <div className="gallery-actions">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {message && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>{message}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadGallery;
