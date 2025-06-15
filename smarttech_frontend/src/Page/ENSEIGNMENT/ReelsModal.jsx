import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ReelsModal = ({ closeModal }) => {
  const [videoPreview, setVideoPreview] = useState(null);
  const { teacherId } = useParams();
  const [videoFile, setVideoFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const previewURL = URL.createObjectURL(file);
      setVideoPreview(previewURL);
    }
  };

  const handleUploadReel = async () => {
    if (!videoFile) {
      alert('Please select a video file');
      return;
    }

    setIsUploading(true);
    try {
      // First upload the video file
      const formData = new FormData();
      formData.append('video', videoFile);

      const uploadResponse = await fetch('http://localhost:9000/api/upload_reel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Video upload failed');
      }

      const { videoUrl } = await uploadResponse.json();

      // Then create the reel entry
      const reelData = {
        url: videoUrl,
        description: description
      };

      const createResponse = await fetch(`http://localhost:9000/api/uploadReel/${teacherId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify(reelData)
      });

      if (!createResponse.ok) {
        throw new Error('Reel creation failed');
      }

      closeModal();
      window.location.reload(); // Refresh to show new reel
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl w-5xl transform transition-all duration-300 hover:scale-[1.01]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Your Reel
          </h3>
          <button 
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Video Upload Area */}
          <div 
            className={`border-2 border-dashed border-gray-200 rounded-xl overflow-hidden ${
              !videoPreview && 'min-h-[200px] flex items-center justify-center'
            }`}
          >
            {videoPreview ? (
              <div className='relative h-96'>
                 <video 
                controls
                className="w-full h-full object-cover"
                src={videoPreview}
              />
              </div>
            ) : (
              <div className="text-center p-8">
                <label className="cursor-pointer">
                  <div className="space-y-4">
                    <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg 
                        className="w-8 h-8 text-blue-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Drag and drop video or{" "}
                        <span className="text-blue-600 hover:text-blue-700">browse files</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        MP4, MOV, or AVI (max 5min)
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a creative caption..."
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              rows="3"
            />
          </div>

          {/* Action Buttons */}
          <div className='sticky bottom-0 bg-white border-t border-gray-100 p-4'>
            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2.5 text-gray-600 hover:text-gray-800 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={handleUploadReel}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                disabled={!videoFile || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ReelsModal
