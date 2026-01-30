import express from 'express';
import {
  createGalleryItem,
  deleteGalleryItem,
  getGalleryItem,
  getGalleryItems,
  updateGalleryItem,
  validateGallery
} from '../controllers/galleryController.js';
import { validate } from '../middlewares/validation.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(getGalleryItems)
  .post(requireAdmin, validateGallery, validate, createGalleryItem);

router
  .route('/:id')
  .get(getGalleryItem)
  .put(requireAdmin, validateGallery, validate, updateGalleryItem)
  .delete(requireAdmin, deleteGalleryItem);

export default router;
