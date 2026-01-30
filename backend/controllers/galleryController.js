import Gallery from '../models/Gallery.js';
import { body, validationResult } from 'express-validator';

// Validation rules
export const validateGallery = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category')
    .isIn(['all', 'hair', 'beard', 'bridal', 'spa'])
    .withMessage('Invalid category'),
  body('image').trim().notEmpty().withMessage('Image URL is required'),
  body('likes').optional().isInt({ min: 0 }).withMessage('Likes must be >= 0')
];

// Create gallery item
export const createGalleryItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const item = await Gallery.create(req.body);
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// Get all gallery items
export const getGalleryItems = async (req, res, next) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// Get single gallery item
export const getGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// Update gallery item
export const updateGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// Delete gallery item
export const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
