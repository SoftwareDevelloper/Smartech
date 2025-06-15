import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostModal = ({ closeModal }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const { teacherId } = useParams();
  const [imageFile, setImageFile] = useState(null);
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(previewURL);
    }
  };

  const handleUploadPost = async () => {
    if (!imageFile) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      // Upload image file
      const formData = new FormData();
      formData.append('file', imageFile);

      const uploadResponse = await fetch('http://localhost:9000/api/upload-post_image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: formData
      });

      if (!uploadResponse.ok) throw new Error('Image upload failed');
      const { imageUrl } = await uploadResponse.json();

      // Create post entry
      const postData = { image: imageUrl, content };
      const createResponse = await fetch(`http://localhost:9000/api/uploadPost/${teacherId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify(postData)
      });

      if (!createResponse.ok) throw new Error('Post creation failed');
      
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl w-4xl transform transition-all duration-300 hover:scale-[1.01]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Your Post
          </h3>
          <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Image Upload Area */}
          <div className={`border-2 border-dashed border-gray-200 rounded-xl overflow-hidden ${!imagePreview && 'min-h-[200px] flex items-center justify-center'}`}>

            </div>
            {imagePreview ? (
              <div className="relative h-96">
                <img  src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2"/>
                <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                 {imageFile?.name}
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <label className="cursor-pointer">
                  <div className="space-y-4">
                    <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg 
                        className="w-8 h-8 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M19 3H5C3.895 3 3 3.895 3 5v14c0 1.105.895 2 2 2h14c1.105 0 2-.895 2-2V5c0-1.105-.895-2-2-2zM8.5 8.5m0 1a1 1 0 110-2 1 1 0 010 2zM21 15l-5-5-5 5"
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M3 15l5-5 5 5"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Drag and drop image or <span className="text-blue-600 hover:text-blue-700">browse files</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, or JPEG (max 5MB)</p>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
            )}
          </div>

          {/* Caption Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Caption</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a creative caption..."
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              rows="2"
            />
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadPost}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                disabled={!imageFile || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default PostModal
