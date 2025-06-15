import { BookOpen, Clapperboard, Grid, Mail, Phone, User, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PostDetailsModal from '../../component/PostDetailsModal';
import i18n from '../../i18n';
import './css/ProfileEns.css';

const ProfileEns = () => {
  const currentLanguage = i18n.language;
  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [currentLanguage]);
  
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { teacherId } = useParams();
  const [activeTab, setActiveTab] = useState("post");
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userRes, postsRes, reelsRes] = await Promise.all([
          fetch(`http://localhost:9000/api/user/${teacherId}`),
          fetch(`http://localhost:9000/api/Post/${teacherId}`),
          fetch(`http://localhost:9000/api/Reel/${teacherId}`)
        ]);
        
        const [userData, postsData, reelsData] = await Promise.all([
          userRes.json(),
          postsRes.json(),
          reelsRes.json()
        ]);
        
        setUser(userData);
        setPosts(postsData);
        setReels(reelsData);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [teacherId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-10 text-gray-500">{t('Teacher not found')}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative">
          {/* Cover Photo Placeholder */}
          <div className="h-48 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-4">
              <div className="relative group">
               <div className="flex-shrink-0 rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center border-4 border-white object-cover shadow-md " >
                  <span className="text-blue-600 font-medium text-2xl">
                    {user?.fullname.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="sm:ml-6 mt-5 sm:mt-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user?.fullname}</h1>
                    <div className="flex items-center mt-1 text-gray-600">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{user?.specialitee}</span>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex mt-4 space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{posts.length}</div>
                    <div className="text-sm text-gray-500">{t('Posts')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{reels.length}</div>
                    <div className="text-sm text-gray-500">{t('Reels')}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bio Section */}
            {user?.about && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  {t('Professional Summary')}
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{user?.about}</p>
              </div>
            )}
            
            {/* Contact Info */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('Contact Details')}
              </h2>
              <div className="flex flex-wrap gap-4">
                <a href={`mailto:${user?.email}`} className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  <Mail className="w-4 h-4 mr-2" />
                  {user?.email}
                </a>
                <a href={`tel:${user?.phone}`} className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  <Phone className="w-4 h-4 mr-2" />
                  {user?.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="mt-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("post")}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === "post" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <Grid className="w-4 h-4 mr-2" />
            {t('Posts')}
          </button>
          <button
            onClick={() => setActiveTab("reel")}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === "reel" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <Clapperboard className="w-4 h-4 mr-2" />
            {t('Reels')}
          </button>
        </nav>
      </div>
      
      {/* Content Grid */}
      <div className="mt-4">
        {activeTab === "post" && (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>{t('No posts available')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <div key={post.id}  className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedPost(post);
                        setShowPostDetails(true);
                      }}>
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-64 object-cover transition-opacity group-hover:opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    {showPostDetails && selectedPost && (
                      <PostDetailsModal
                        post={selectedPost} 
                        onClose={() => setShowPostDetails(false)} 
                      />
                    )}
                  </div>
                  
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === "reel" && (
          <>
            {reels.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>{t('No reels available')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {reels.map((reel) => (
                  <div key={reel.id} className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <video
                      className="w-full h-64 object-cover"
                      controls
                      loop
                      preload="metadata"
                      poster={reel.thumbnail || '/video-placeholder.jpg'}
                    >
                      <source src={reel.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full p-1.5">
                      <Video className="text-white w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {showPostDetails && selectedPost && (
        <PostDetailsModal 
          post={selectedPost} 
          onClose={() => setShowPostDetails(false)} 
        />
      )}
    </div>
  );
};

export default ProfileEns;