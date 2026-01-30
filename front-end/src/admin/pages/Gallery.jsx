import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Trash2, Eye, Download, X, Link as LinkIcon, Loader2, Calendar, Tag, ChevronLeft, ChevronRight, Maximize2, ExternalLink, FileImage } from 'lucide-react';

// API functions
import { 
  fetchAllGalleryImages, 
  uploadGalleryImage, 
  deleteGalleryImage 
} from '../../api/gallery';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Hair',
    description: '',
    imageUrl: ''
  });
  const [previewError, setPreviewError] = useState('');

  // Categories from your data
  const categories =  ['all', 'hair', 'beard', 'bridal', 'spa'];

  // Fetch gallery images
  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAllGalleryImages();
      setImages(data || []);
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      setError('Failed to load gallery images. Please try again.');
      // Fallback data
      setImages([
        { _id: 1, title: 'Hair Style #1', category: 'Hair', date: '2024-01-15', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w-400&h=300&fit=crop' },
        { _id: 2, title: 'Beard Design', category: 'Beard', date: '2024-01-12', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w-400&h=300&fit=crop' },
        { _id: 3, title: 'Salon Interior', category: 'Salon', date: '2024-01-10', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w-400&h=300&fit=crop' },
        { _id: 4, title: 'Color Work', category: 'Hair', date: '2024-01-08', url: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w-400&h=300&fit=crop' },
        { _id: 5, title: 'Team Photo', category: 'Team', date: '2024-01-05', url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w-400&h=300&fit=crop' },
        { _id: 6, title: 'Customer Happy', category: 'Customers', date: '2024-01-03', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w-400&h=300&fit=crop' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Validate image URL
  const validateImageUrl = (url) => {
    try {
      new URL(url);
      return url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) != null;
    } catch {
      return false;
    }
  };

  // Test image URL
  const testImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear preview error when URL changes
    if (name === 'imageUrl') {
      setPreviewError('');
    }
  };

  // Reset upload form
  const resetUploadForm = () => {
    setUploadForm({
      title: '',
      category: 'Hair',
      description: '',
      imageUrl: ''
    });
    setPreviewError('');
  };

  // Open detail view
  const openDetailView = (image) => {
    const index = filteredImages.findIndex(img => img._id === image._id);
    if (index !== -1) {
      setCurrentDetailIndex(index);
      setShowDetail(true);
    }
  };

  // Navigate to previous image in detail view
  const navigateToPrevious = () => {
    if (currentDetailIndex > 0) {
      setCurrentDetailIndex(currentDetailIndex - 1);
    }
  };

  // Navigate to next image in detail view
  const navigateToNext = () => {
    if (currentDetailIndex < filteredImages.length - 1) {
      setCurrentDetailIndex(currentDetailIndex + 1);
    }
  };

  // Get current image for detail view
  const getCurrentImage = () => {
    return filteredImages[currentDetailIndex];
  };

  // Handle image upload via URL
  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!uploadForm.title.trim()) {
      alert('Please enter a title for the image');
      return;
    }
    
    if (!uploadForm.imageUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }
    
    if (!validateImageUrl(uploadForm.imageUrl)) {
      alert('Please enter a valid image URL (must end with .jpg, .png, .gif, etc.)');
      return;
    }
    
    setUploading(true);
    setPreviewError('');
    
    try {
      // Test if image URL is accessible
      const isImageValid = await testImageUrl(uploadForm.imageUrl);
      
      if (!isImageValid) {
        setPreviewError('Cannot load image from this URL. Please check the URL and try again.');
        setUploading(false);
        return;
      }
      
      // Prepare data for API
      const imageData = {
        title: uploadForm.title,
        category: uploadForm.category.toLowerCase(),
        description: uploadForm.description,
        image: uploadForm.imageUrl
      };
      
      const newImage = await uploadGalleryImage(imageData);
      
      // Add new image to the list
      setImages(prev => [newImage, ...prev]);
      
      // Close form and reset
      setShowUploadForm(false);
      resetUploadForm();
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setPreviewError(`Failed to upload image: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    } finally {
      setUploading(false);
    }
  };

  // Handle image delete
  const handleDeleteImage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await deleteGalleryImage(id);
      setImages(images.filter(img => img._id !== id));
      // Close detail view if the deleted image was being viewed
      if (showDetail && getCurrentImage()?._id === id) {
        setShowDetail(false);
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image. Please try again.');
    }
  };

  // Handle image preview
  const handlePreview = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  // Handle image download
  const handleDownload = async (imageUrl, title) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading image:', err);
      alert('Failed to download image. Please try again.');
    }
  };

  // Filter images by category
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-600">Manage your salon portfolio and images</p>
        </div>
        <button 
          onClick={() => setShowUploadForm(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
        >
          <Plus size={20} />
          Add Image from URL
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-amber-500" size={32} />
          <span className="ml-3 text-gray-600">Loading gallery...</span>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-amber-50 rounded-2xl border border-amber-100">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
            <ImageIcon className="text-amber-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-600 mb-6">
            {selectedCategory !== 'All' 
              ? `No images in ${selectedCategory} category` 
              : 'Add your first image to get started'}
          </p>
          <button 
            onClick={() => setShowUploadForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
          >
            <LinkIcon size={20} />
            Add Image from URL
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            Showing {filteredImages.length} of {images.length} images
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </div>
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div 
                key={image._id} 
                onClick={() => openDetailView(image)}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={image.image} 
                    alt={image.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=300&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handlePreview(image.image)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                          title="Preview in new tab"
                        >
                          <Eye size={18} className="text-gray-800" />
                        </button>
                        <button 
                          onClick={() => handleDownload(image.image, image.title)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                          title="Download"
                        >
                          <Download size={18} className="text-gray-800" />
                        </button>
                        <button 
                          onClick={() => handleDeleteImage(image._id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{image.title}</h3>
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                      {image.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={14} />
                    <span>{new Date(image.date || image.createdAt).toLocaleDateString()}</span>
                  </div>
                  {image.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{image.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Image Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Image from URL</h2>
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    resetUploadForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <LinkIcon className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="url"
                      name="imageUrl"
                      value={uploadForm.imageUrl}
                      onChange={handleInputChange}
                      required
                      disabled={uploading}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter a direct link to an image (jpg, png, gif, webp, svg)
                  </p>
                </div>

                {/* Image Preview */}
                {uploadForm.imageUrl && validateImageUrl(uploadForm.imageUrl) && (
                  <div className="border border-gray-200 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <div className="relative rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={uploadForm.imageUrl} 
                        alt="Preview" 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          setPreviewError('Cannot load image preview. URL may be invalid or image is not accessible.');
                        }}
                        onLoad={() => setPreviewError('')}
                      />
                      {previewError && (
                        <div className="absolute inset-0 bg-red-50 flex items-center justify-center p-4">
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
                              <X className="text-red-600" size={24} />
                            </div>
                            <p className="text-sm text-red-600">{previewError}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      Make sure the image displays correctly above
                    </p>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={uploadForm.title}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    placeholder="e.g., Hair Style #1"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={uploadForm.category}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                  >
                    {categories.filter(c => c !== 'all').map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={uploadForm.description}
                    onChange={handleInputChange}
                    disabled={uploading}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    placeholder="Brief description of the image..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadForm(false);
                      resetUploadForm();
                    }}
                    disabled={uploading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || previewError}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading && <Loader2 size={20} className="animate-spin" />}
                    {uploading ? 'Adding Image...' : 'Add Image'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Image Detail View Modal */}
      {showDetail && getCurrentImage() && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Image Details</h2>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Main Image */}
              <div className="mb-8">
                <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-4">
                  <img 
                    src={getCurrentImage().image} 
                    alt={getCurrentImage().title}
                    className="w-full h-auto max-h-[500px] object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=300&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handlePreview(getCurrentImage().image)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                      title="Open in new tab"
                    >
                      <ExternalLink size={20} className="text-gray-800" />
                    </button>
                    <button 
                      onClick={() => handleDownload(getCurrentImage().image, getCurrentImage().title)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                      title="Download"
                    >
                      <Download size={20} className="text-gray-800" />
                    </button>
                  </div>
                </div>

                {/* Image Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title and Category */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FileImage size={20} className="text-amber-600" />
                      <span className="text-sm font-medium text-gray-700">Image Title</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{getCurrentImage().title}</h3>
                    <div className="mt-3 flex items-center gap-2">
                      <Tag size={16} className="text-amber-600" />
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
                        {getCurrentImage().category}
                      </span>
                    </div>
                  </div>

                  {/* Date and ID */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={20} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Upload Date</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(getCurrentImage().date || getCurrentImage().createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      <span className="font-medium">ID:</span> {getCurrentImage()._id}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {getCurrentImage().description && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <LinkIcon size={20} className="text-gray-600" />
                      <h4 className="text-lg font-semibold text-gray-900">Description</h4>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-amber-50 p-5 rounded-xl border border-amber-100">
                      <p className="text-gray-700 leading-relaxed">{getCurrentImage().description}</p>
                    </div>
                  </div>
                )}

                {/* Image URL */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <LinkIcon size={20} className="text-gray-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Image URL</h4>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{getCurrentImage().image}</p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(getCurrentImage().image);
                          alert('URL copied to clipboard!');
                        }}
                        className="px-3 py-1 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors whitespace-nowrap"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation and Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                {/* Navigation */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={navigateToPrevious}
                    disabled={currentDetailIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">
                    {currentDetailIndex + 1} of {filteredImages.length}
                  </span>
                  <button
                    onClick={navigateToNext}
                    disabled={currentDetailIndex === filteredImages.length - 1}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowDetail(false);
                      // Here you could add edit functionality if needed
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200"
                  >
                    <LinkIcon size={16} />
                    View Original
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this image?')) {
                        handleDeleteImage(getCurrentImage()._id);
                        setShowDetail(false);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                    Delete Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}