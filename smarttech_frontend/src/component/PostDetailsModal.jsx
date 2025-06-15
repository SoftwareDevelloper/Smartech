import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const PostDetailsModal = ({ post, onClose }) => {
  const { t } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [currentLanguage]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg flex flex-col md:flex-row overflow-hidden w-full max-w-4xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>

        {/* Left Side: Content */}
        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center bg-gray-50">
          <h3 className="font-semibold mb-2">{t('Content')}</h3>
          <p className="whitespace-pre-line">{post.content}</p>
        </div>

        {/* Right Side: Image */}
        {post.image && (
          <div className="w-full md:w-1/2 bg-black">
            <img
              src={post.image}
              alt="Post"
              className="object-cover w-full h-full max-h-[500px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailsModal;
