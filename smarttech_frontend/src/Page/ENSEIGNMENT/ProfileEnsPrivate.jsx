import { BookOpen, Clapperboard, Grid, ImagePlus, Mail, Phone, Plus, User, Video } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PostDetailsModal from '../../component/PostDetailsModal';
import i18n from '../../i18n';
import './css/ProfileEnsPrivate.css';
import PostModal from './PostModal';
import ReelsModal from './ReelsModal';

const ProfileEnsPrivate = () => {
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
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showReelsModal, setShowReelsModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userRes, postsRes, reelsRes] = await Promise.all([
          fetch(`https://smartech-production-1020.up.railway.app/api/user/${teacherId}`),
          fetch(`https://smartech-production-1020.up.railway.app/api/Post/${teacherId}`),
          fetch(`https://smartech-production-1020.up.railway.app/api/Reel/${teacherId}`)
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

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openReelsModal = () => {
    setShowReelsModal(true);
    setOpenDropdown(false);
  };

  const openPostModal = () => {
    setShowPostModal(true);
    setOpenDropdown(false);
  };

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
    <div className="p-4 sm:ml-64 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              
              <div className="sm:ml-6 mt-4 sm:mt-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user?.fullname}</h1>
                    <div className="flex items-center mt-1 text-gray-600">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{user?.specialitee}</span>
                    </div>
                  </div>
                  
                  {/* Upload Dropdown */}
                  <div className="relative mt-4 sm:mt-0" ref={dropdownRef}>
                    <button 
                      onClick={toggleDropdown}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      <span>{t('Create')}</span>
                    </button>
                    
                    {openDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div 
                          className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          onClick={openPostModal}
                        >
                          <ImagePlus className="w-4 h-4" />
                          {t('NewPost')}
                        </div>
                        <div 
                          className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          onClick={openReelsModal}
                        >
                          <Video className="w-4 h-4" />
                          {t('NewReel')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex mt-4 space-x-6">
                  <div className="text-center cursor-pointer" onClick={() => setActiveTab("post")}>
                    <div className={`text-lg font-semibold ${activeTab === "post" ? "text-blue-600" : "text-gray-900"}`}>
                      {posts.length}
                    </div>
                    <div className="text-sm text-gray-500">{t('Posts')}</div>
                  </div>
                  <div className="text-center cursor-pointer" onClick={() => setActiveTab("reel")}>
                    <div className={`text-lg font-semibold ${activeTab === "reel" ? "text-blue-600" : "text-gray-900"}`}>
                      {reels.length}
                    </div>
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
                  {t('ProfessionalSummary')}
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
                {t('ContactDetails')}
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
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ImagePlus className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{t('Nopostsyet')}</h3>
                <p className="mt-1 text-gray-500 max-w-md mx-auto">
                  {t('Share')}
                </p>
                <button
                  onClick={openPostModal}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  {t('CreatePost')}
                </button>
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
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Video className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{t('Noreel')}</h3>
                <p className="mt-1 text-gray-500 max-w-md mx-auto">
                  {t('CreateReel')}
                </p>
                <button
                  onClick={openReelsModal}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Video className="w-4 h-4 mr-2" />
                  {t('CreatesReel')}
                </button>
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
      
      {/* Modals */}
      {showReelsModal && <ReelsModal closeModal={() => setShowReelsModal(false)} />}
      {showPostModal && <PostModal closeModal={() => setShowPostModal(false)} />}
        {showPostDetails && selectedPost && (
        <PostDetailsModal 
          post={selectedPost} 
          onClose={() => setShowPostDetails(false)} 
        />
      )}
    </div>
  );
};

export default ProfileEnsPrivate;
