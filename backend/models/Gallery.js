import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['all', 'hair', 'beard', 'bridal', 'spa'],
    default: 'all'
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  beforeAfter: {
    before: {
      type: String,
      trim: true
    },
    after: {
      type: String,
      trim: true
    }
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
