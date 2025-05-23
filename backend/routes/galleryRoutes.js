import express from "express";
import {
  addGalleryMedia,
  getGalleryMedia,
  updateGalleryMedia,
  deleteGalleryMedia,
  uploadMedia, // ✅ import this from controller
} from "../controllers/galleryController.js";

const router = express.Router();

// Routes
router.post("/", uploadMedia, addGalleryMedia);
router.get("/", getGalleryMedia);
router.put("/:id", uploadMedia, updateGalleryMedia);
router.delete("/:id", deleteGalleryMedia);

export default router;
