import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/Gallery.css';

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://salon-one-rose.vercel.app/api/gallery')
      .then((res) => setGalleryItems(res.data))
      .catch((err) => setError('Failed to fetch gallery items.'));
  }, []);

  const isVideo = (filename) => /\.(mp4|webm|ogg)$/i.test(filename);

  return (
    <div className="gallery-wrapper">
      <h1>Gallery</h1>

      {error && <p className="error-message">{error}</p>}

      {/* Image Section */}
      <div className="gallery-images">
        <h2>Images</h2>
        <div className="gallery-grid gallery-images-grid">
          {galleryItems
            .filter((item) => !isVideo(item.imageUrl))
            .map((img) => (
              <div key={img._id} className="gallery-card">
                <div className="gallery-image">
                  <img
                    src={img.imageUrl}  // Cloudinary or your media URL
                    alt="Gallery"
                    className="gallery-img"
                  />
                </div>
                {img.description && <p className="image-description">{img.description}</p>}
              </div>
            ))}
        </div>
      </div>

      {/* Video Section */}
      <div className="gallery-videos">
        <h2>Videos</h2>
        <div className="gallery-grid gallery-videos-grid">
          {galleryItems
            .filter((item) => isVideo(item.imageUrl))
            .map((video) => (
              <div key={video._id} className="gallery-card">
                <div className="gallery-video">
                  <video controls className="gallery-video-player">
                    <source src={video.imageUrl} /> {/* Cloudinary or your media URL */}
                    Your browser does not support the video tag.
                  </video>
                </div>
                {video.description && <p className="video-description">{video.description}</p>}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
