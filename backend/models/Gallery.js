import mongoose from "mongoose";

// Define schema for gallery items (images/videos)
const gallerySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true, // URL for the media (image/video path)
    },
    description: {
      type: String,
      required: false,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: true, // Ensure the media type is either 'image' or 'video'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stylist", // Reference to the stylist who created the item
    },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
