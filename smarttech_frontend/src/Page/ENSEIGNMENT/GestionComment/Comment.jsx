import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronUp, FaReply, FaThumbsDown, FaThumbsUp } from "react-icons/fa";

const Comment = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [imagePreview] = useState("https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState({});
  const [replies, setReplies] = useState({});
  const{t,i18n} = useTranslation()
  const currentLanguage = i18n.language; 
  useEffect(()=>{
    window.document.dir = i18n.dir();
  },[currentLanguage])

  // Fetch comments with author names
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://smartech-production-1020.up.railway.app/api/v2/approveComment");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const commentsData = await response.json();
      const commentsWithAuthors = await Promise.all(
        commentsData.map(async comment => {
          try {
            const nameResponse = await fetch(`https://smartech-production-1020.up.railway.app/api/v2/GetNameApprenant/${comment.id}`);
            const fullname = nameResponse.ok ? await nameResponse.text() : 'Anonymous';
            return { ...comment, fullname };
          } catch (error) {
            console.error('Error fetching author name:', error);
            return { ...comment, fullname: 'Anonymous' };
          }
        })
      );
      
      setComments(commentsWithAuthors);
      await fetchInitialReplies(commentsWithAuthors.map(c => c.id));
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial replies for comments
  const fetchInitialReplies = async (commentIds) => {
    try {
      const repliesData = await Promise.all(
        commentIds.map(async id => {
          const response = await fetch(`https://smartech-production-1020.up.railway.app/api/v2/replies/comment/${id}`);
          if (!response.ok) return [];
          
          const replies = await response.json();
          return replies.map(reply => ({
            ...reply,
            fullname: reply.internote?.fullname || 'Anonymous',
            image: reply.internote?.image || imagePreview
          }));
        })
      );
      
      const repliesMap = {};
      commentIds.forEach((id, index) => {
        repliesMap[id] = repliesData[index];
      });
      
      setReplies(repliesMap);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  // Handle reply button click
  const handleReplyClick = (commentId) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText("");
  };

  // Handle reply submission
  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;
    
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const decodedToken = jwtDecode(token);
      const authorId = decodedToken.sub;
      
      const response = await fetch(`https://smartech-production-1020.up.railway.app/api/v2/replies/${commentId}/${authorId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: replyText
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to post reply");
      }
  
      // Refresh replies for this comment
      const updatedReplies = await fetch(`https://smartech-production-1020.up.railway.app/api/v2/replies/comment/${commentId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }).then(res => res.json());
      
      setReplies(prev => ({ ...prev, [commentId]: updatedReplies }));
      setReplyingTo(null);
      setReplyText("");
    } catch (error) {
      console.error("Error posting reply:", error);
      setError(error.message);
    }
  };

  // Toggle replies visibility
  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  if (loading) return (
    <div className="p-4 sm:ml-64 flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-4 sm:ml-64 flex justify-center items-center h-screen">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 sm:ml-64 min-h-screen" style={{fontFamily:"Montserrat, sans-serif"}}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">{t('CommunityDiscussions')}</h1>
        
        {comments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">{t('NoComment')} </p>
          </div> 
        ) : (
          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex gap-4">
                    <img 
                      src={comment.image || imagePreview} 
                      alt="User" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                    />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-semibold text-gray-800">{comment.fullname}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.date).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <p className="mt-2 text-gray-600">{comment.message}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <button 
                          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                          onClick={() => handleReplyClick(comment.id)}
                        >
                          <FaReply className="text-sm" />
                          <span> {t('Reply')} </span>
                        </button>
                        {replies[comment.id]?.length > 0 && (
                          <button 
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors"
                            onClick={() => toggleReplies(comment.id)}
                          >
                            {showReplies[comment.id] ? (
                              <>
                                <FaChevronUp className="text-xs" />
                                <span> {t('Hide')} </span>
                              </>
                            ) : (
                              <>
                                <FaChevronDown className="text-xs" />
                                <span>{replies[comment.id].length} {replies[comment.id].length === 1 ? t('reply') : t('replies')}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Reply form */}
                      {replyingTo === comment.id && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200">
                          <div className="flex gap-3">
                            <img 
                              src={imagePreview} 
                              alt="You" 
                              className="w-10 h-10 mt-1 rounded-full border-2 border-white shadow-sm" 
                            />
                            <div className="flex-1">
                              <textarea
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                                rows="3"
                                placeholder={t('Writeyourreply')}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                              />
                              <div className="flex justify-end gap-3 mt-2">
                                <button 
                                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                  onClick={() => setReplyingTo(null)}
                                >
                                  {t('Cancel')}
                                </button>
                                <button 
                                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                                  onClick={() => handleReplySubmit(comment.id)}
                                >
                                 {t('Send')} 
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Replies list */}
                {showReplies[comment.id] && replies[comment.id]?.length > 0 && (
                  <div className="bg-gray-50 border-t border-gray-100 px-5 py-3">
                    <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                      {replies[comment.id].map(reply => (
                        <div key={reply.id} className="flex gap-3 pt-3">
                          <img 
                            src={reply.internote?.image || imagePreview} 
                            alt="Replier" 
                            className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
                          />
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                              <span className="text-sm font-semibold text-gray-700">
                                {reply.fullname || 'Anonymous'}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(reply.date).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{reply.message}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                                <FaThumbsUp size={10} />
                                <span>Like</span>
                              </button>
                              <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                                <FaThumbsDown size={10} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
