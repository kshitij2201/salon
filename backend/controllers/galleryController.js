import Gallery from "../models/Gallery.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

// Use memoryStorage for Cloudinary uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
export const uploadMedia = upload.single("media");

export const getGalleryMedia = async (req, res) => {
  try {
    const galleryMedia = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(galleryMedia);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery media", error: error.message });
  }
};

export const addGalleryMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No media uploaded" });

    const { description, createdBy } = req.body;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "salon_gallery",
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Cloudinary upload error", error });
        }

        const mediaType = result.resource_type;

        const newMedia = new Gallery({
          imageUrl: result.secure_url,
          description,
          createdBy,
          mediaType,
        });

        await newMedia.save();
        res.status(201).json(newMedia);
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Error adding gallery media", error: error.message });
  }
};

export const updateGalleryMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, createdBy } = req.body;

    const media = await Gallery.findById(id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    if (req.file) {
      // Optional: delete old media from Cloudinary if you stored public_id

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "salon_gallery",
        },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Cloudinary upload error", error });
          }

          media.imageUrl = result.secure_url;
          media.mediaType = result.resource_type;
          if (description) media.description = description;
          if (createdBy) media.createdBy = createdBy;

          await media.save();
          res.status(200).json(media);
        }
      );

      uploadStream.end(req.file.buffer);
    } else {
      if (description) media.description = description;
      if (createdBy) media.createdBy = createdBy;
      await media.save();
      res.status(200).json(media);
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating gallery media", error: error.message });
  }
};

export const deleteGalleryMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Gallery.findById(id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    // Optional: Delete from Cloudinary if public_id is saved

    await media.deleteOne();
    res.status(200).json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting gallery media", error: error.message });
  }
};
