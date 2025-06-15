import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { jwtDecode } from 'jwt-decode';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLock, FaMoneyCheckAlt, FaPlay, FaReply, FaStar, FaThumbsDown, FaThumbsUp, FaUnlock } from "react-icons/fa"; // Import Star Icon
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './displaycours.css';
const stripePromise = loadStripe('pk_test_51QuIjVQ4ow2EgFdTQRmumHrybc7VO6XcWgxsp4zhayguXZzy9ALJIPwwUmlqJxwC2DrevIrYainuY39lirifeJqR00drg0oc2C');
const PaymentModal = ({ chapter, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const{t,i18n} = useTranslation()
  const currentLanguage = i18n.language; 
    useEffect(()=>{
      window.document.dir = i18n.dir();
    },[currentLanguage])
  const handlePayment = async () => {
    
    if (!stripe || !elements) return;
  
    setPaymentProcessing(true);
    setErrorMessage('');
  
    try {
      // 1. Create payment intent
      const response = await fetch('http://localhost:9000/api/v1/Checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chapterId: chapter.id,
          amount: chapter.price * 100 ,
          currency: 'usd'
        })
      });
  
      // 2. Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment initialization failed');
      }
  
      // 3. Parse JSON response
      const data = await response.json();
      
      // 4. Validate client secret
      if (!data.clientSecret) {
        throw new Error('Missing client secret from server');
      }
  
      // 5. Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret, // Use data.clientSecret instead of response.clientSecret
        {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        }
      );
  
      if (error) throw error;
      
      if (paymentIntent.status === 'succeeded') {
        onSuccess(chapter.id);
        onClose();
      }
    } catch (error) {
      setErrorMessage(error.message || 'Payment failed');
    } finally {
      setPaymentProcessing(false);
    }
  };
  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h3>{t('UnlockChapter')}:
          {currentLanguage === 'fr'
          ? chapter.titleFr
          : currentLanguage === 'ar'
          ? chapter.titleAr
          : chapter.titleEn}</h3>
        <p>{t('Price')}:{chapter.price} TND</p>
        
        <div className="card-element-wrapper">
          <CardElement options={{ hidePostalCode: true }} />
        </div>

        {errorMessage && <div className="payment-error">{errorMessage}</div>}

        <div className="payment-actions">
          <button className="cancel-btn" onClick={onClose} disabled={paymentProcessing}>
             {t('Cancel')}
          </button>
          <button 
            className="confirm-btn"
            onClick={handlePayment}
            disabled={paymentProcessing || !stripe}
          >
            {paymentProcessing ? t('Processing...') : t('ConfirmPayment')}
          </button>
        </div>
      </div>
    </div>
  );
};


// Display course // 
const Displaycours = () => {
    const{t,i18n} = useTranslation()
    const currentLanguage = i18n.language; 
      useEffect(()=>{
        window.document.dir = i18n.dir();
      },[currentLanguage])
    const [cours,setCours]=useState([])
    const [imagePreview] = useState("https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg");
    const { id } = useParams(); 
    const [showReplies, setShowReplies] = useState({});
    const [replies, setReplies] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [error, setError] = useState(null);
    const [userComments, setUserComments] = useState([]); // Track user's own pending comments
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [lockedChapters, setLockedChapters] = useState(new Set());
    const [chapterToUnlock, setChapterToUnlock] = useState(null);  
    const [progressRate, setProgressRate] = useState(0);
        useEffect(() => {
          // Fetch chapters
          fetch(`http://localhost:9000/api/chapters/formation/${id}`)
            .then(response => response.json())
            .then(data => {
              const sortedChapters = data.sort((a, b) => a.chapterOrder - b.chapterOrder);
              setChapters(sortedChapters);
              
              if (sortedChapters.length > 0) {
                const firstChapterId = sortedChapters[0].id;
                const initiallyLocked = sortedChapters
                  .filter(c => c.locked && c.id !== firstChapterId)
                  .map(c => c.id);
                
                setLockedChapters(new Set(initiallyLocked));
                setSelectedChapter(sortedChapters[0]);
              }
            })
            .catch(error => console.error('Error fetching chapters:', error));
        }, [id]);
        const handleDownloadCours = async (chapterId) => {
          try {
            const response = await fetch(`http://localhost:9000/api/chapters/download-cours/${chapterId}`, {
              headers: {
                'Content-Type': 'application/json',
              }
            });
        
            if (!response.ok) throw new Error('Failed to download');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chapter-${chapterId}-cours.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          } catch (error) {
            toast.error('Failed to download file');
          }
        };
        
        const handleDownloadTD = async (chapterId) => {
          try {
            const response = await fetch(`http://localhost:9000/api/chapters/download-td/${chapterId}`, {
              headers: {
                'Content-Type': 'application/json',
              }
            });
        
            if (!response.ok) throw new Error('Failed to download');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chapter-${chapterId}-td.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          } catch (error) {
            toast.error('Failed to download file');
          }
        };
        const handleChapterSelect = (chapter) => {
          if (!lockedChapters.has(chapter.id)) {
            setSelectedChapter(chapter);
          }
        };
      
        const handleCompleteChapter = async (chapterId) => {
          try {
            const token = localStorage.getItem('auth-token');
            const userId = jwtDecode(token).sub;
            
            const response = await fetch(`http://localhost:9000/api/chapter-progress/complete?userId=${userId}&chapterId=${chapterId}`, {
              method: 'POST'
            });
            if (response.ok) {
              const nextChapter = chapters.find(c => c.chapterOrder === selectedChapter.chapterOrder + 1);
              if (nextChapter) {
                setLockedChapters(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(nextChapter.id);
                  return newSet;
                });
              }
              toast.success('Chapter marked as completed!');
            }
          } catch (error) {
            toast.error('Error updating progress');
          }
        };
        const handlePaymentSuccess = async (chapterId) => {
          try {
            const token = localStorage.getItem('auth-token');
            if (!token) throw new Error('User not authenticated');
            
            const userId = jwtDecode(token).sub;
        
            // Call backend to unlock chapter
            const response = await fetch(
              `http://localhost:9000/api/chapter-progress/unlock-chapter?userId=${userId}&chapterId=${chapterId}`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
        
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to unlock chapter');
            }
        
            // Update UI state
            setLockedChapters(prev => {
              const newSet = new Set(prev);
              newSet.delete(chapterId);
              return newSet;
            });
        
            toast.success('Chapter unlocked successfully!');
            setShowPaymentModal(false);
            
          } catch (error) {
            console.error('Unlock Error:', error);
            toast.error(error.message || 'Payment succeeded but chapter unlock failed');
          }
        };


        
        const [formData , setformData] = useState({
          message:"",
          date:new Date().toISOString(),
          rating:""
        })
        const changeHandler = (e) =>{
          setformData({...formData, [e.target.name]:e.target.value});
        } 

        const comment = async () => {
          if (!formData.message ||  !formData.rating) {
              toast.error("Please fill in all fields.");
              return;
          }
      
          try {
              const token = localStorage.getItem("auth-token");
              if (!token) {
                  toast.error("You must be logged in to comment.");
                  return;
              }
      
              const decodedToken = jwtDecode(token);
              const user_id = decodedToken.sub;
      
              // Convert the form data to match backend expectations
              const commentData = {
                  message: formData.message,
                  date: new Date(formData.date), // Convert to JavaScript Date object
                  rating: parseFloat(formData.rating) // Convert to number
              };
      
              const response = await fetch(`http://localhost:9000/api/v2/Comment/${user_id}/${id}`, {
                  method: "POST",
                  headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                  },
                  body: JSON.stringify(commentData)
              });
      
              if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || "Failed to post comment");
              }
              const newComment = await response.json();
            
              // Add to user's pending comments
              setUserComments(prev => [...prev, {
                  ...newComment,
                  fullname: decodedToken.fullname || "You",
                  status: "PENDING"
              }]);
              toast.success("Comment submitted for approval!");
              setformData({ message: "",rating: "" });
              fetchComments();
          } catch (error) {
              console.error("Comment submission error:", error);
              toast.error(error.message || "Failed to post comment");
          }
      };

        const [comments , setComment] = useState([])

        const fetchComments = async () => {
          try {
              const response = await fetch(`http://localhost:9000/api/v2/approved-comments/${id}`);
              
              if (!response.ok) {
                  throw new Error(`Failed to load comments: ${response.status}`);
              }
  
              const data = await response.json();
              
              // Fetch full names for each comment
              const commentsWithFullname = await Promise.all(
                  data.map(async (comment) => {
                      try {
                          const fullnameResponse = await fetch(
                              `http://localhost:9000/api/v2/GetNameApprenant/${comment.id}`
                          );
                          
                          if (!fullnameResponse.ok) {
                              return { ...comment, fullname: 'User' };
                          }
  
                          const fullname = await fullnameResponse.text();
                          return { ...comment, fullname };
                      } catch (error) {
                          return { ...comment, fullname: 'User' };
                      }
                  })
              );
  
              setComment(commentsWithFullname);
              await fetchInitialReplies(commentsWithFullname.map(c => c.id));
          } catch (error) {
              console.error('Error fetching comments:', error);
              toast.error('Failed to load comments');
          }
      };
  
  useEffect(() => {
    fetchComments();
  }, []);
const fetchInitialReplies = async (commentIds) => {
  try {
    const repliesData = await Promise.all(
      commentIds.map(async id => {
        const response = await fetch(`http://localhost:9000/api/v2/replies/comment/${id}`);
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
  
  const [rating, setRating] = useState(0); 

  const handleRating = async (selectedRating) => {
    setRating(selectedRating);
    try {
      const token = localStorage.getItem("auth-token");
      let user_id = "";
      if (token) {
        const decodedToken = jwtDecode(token);
        user_id = decodedToken.sub;
      }
      await fetch(`http://localhost:9000/api/Rating/${id}/${user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: selectedRating }),
      });
      toast.success(`thanks for your rating`);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
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
        
        const response = await fetch(`http://localhost:9000/api/v2/replies/${commentId}/${authorId}`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Add auth token to headers if needed
          },
          body: JSON.stringify({
            message: replyText // Only send the message as your backend expects
          }),
        });
    
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to post reply");
        }
    
        // Refresh replies for this comment
        const updatedReplies = await fetch(`http://localhost:9000/api/v2/replies/comment/${commentId}`, {
          headers: {
            "Authorization": `Bearer ${token}` // Include token if needed
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
  
 
    useEffect(() => {
      fetchComments();
    }, []);

  const fetchProgressRate = async () => {
  try {
    const token = localStorage.getItem('auth-token');
    const userId = jwtDecode(token).sub;

    const response = await fetch(`http://localhost:9000/api/chapter-progress/rate?userId=${userId}&formationId=${id}`);
    const rate = await response.json();
    setProgressRate(rate);
  } catch (error) {
    console.error('Error fetching progress rate:', error);
  }
};
fetchProgressRate();

  return (
    <div className="big">
    {
        cours ? (
            <>
            <div className="session">
              <div className="left">
                <div className="course-container">
                    <div className="course-main-content">
                      {selectedChapter && (
                        <>
                            <div className="video-player">
                              <video 
                                controls 
                                className="w-full"
                              >
                                <source src={selectedChapter?.videoUrl} type="video/mp4" />
                              </video>
                            </div>
                          <div className="progress-container">
                            <label>{t('Progression')} : {Math.round(progressRate)}%</label>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${progressRate}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="chapter-info">
                            <h2>
                            {currentLanguage === 'fr'
                              ? selectedChapter.titleFr
                              : currentLanguage === 'ar'
                              ? selectedChapter.titleAr
                              : selectedChapter.titleEn}
                            </h2>
                            <p>
                            {currentLanguage === 'fr'
                              ? selectedChapter.descriptionFr
                              : currentLanguage === 'ar'
                              ? selectedChapter.descriptionAr
                              : selectedChapter.descriptionEn}
                            </p>
                            
                            <div className="progress-actions">
                              <button 
                                className="complete-btn"
                                onClick={() => handleCompleteChapter(selectedChapter.id)}
                              >
                                <FaPlay /> {t('MarkasCompleted')}
                              </button>
                              <button 
                                className="download-btn"
                                onClick={() => handleDownloadCours(selectedChapter.id)}
                              >
                                <Download /> {t('DownloadCours')}
                              </button>
                              <button 
                                className="download-btn"
                                onClick={() => handleDownloadTD(selectedChapter.id)}

                              >
                                <Download /> {t('DownloadExercices')}
                              </button>
  
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="chapters-sidebar">
                      <h3> {t('CourseChapters')} </h3>
                      <div className="chapters-list">
                      {chapters.map((chapter, index) => (
                        <div 
                          key={chapter.id}
                          className={`chapter-item ${selectedChapter?.id === chapter.id ? 'active' : ''} 
                                    ${lockedChapters.has(chapter.id) ? 'locked' : ''}`}
                          onClick={() => handleChapterSelect(chapter)}
                        >
                        <div className="chapter-status">
                          {lockedChapters.has(chapter.id) ? (
                            <FaLock className="lock-icon" />
                          ) : (
                            <FaUnlock className="lock-icon" />
                          )}
                        </div>
                  
                        <div className="chapter-details">
                          <h4>
                            {currentLanguage === 'fr'
                              ? chapter.titleFr
                              : currentLanguage === 'ar'
                              ? chapter.titleAr
                              : chapter.titleEn}
                          </h4>
                          <p>
                            {currentLanguage === 'fr'
                            ? chapter.descriptionFr
                            : currentLanguage === 'ar'
                            ? chapter.descriptionAr
                            : chapter.descriptionEn}
                          </p>
                          
                          {lockedChapters.has(chapter.id) ? (
                            <button 
                              className="unlock-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setChapterToUnlock(chapter);  // Store the chapter user is trying to unlock
                                setShowPaymentModal(true);
                              }}
                            >
                              <FaMoneyCheckAlt /> 
                              {index === 0 ? 'Free Preview' : `Unlock Chapter ($${chapter.price || '9.99'})`}
                            </button>
                          ) : (
                            index === 0 && <span className="free-badge">Free</span>
                          )}
                        </div>
                        </div>
                      ))}
                      </div>
                    </div>

                {showPaymentModal && (
                  <Elements stripe={stripePromise}>
                    <PaymentModal  
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handlePaymentSuccess}
                    chapter={chapterToUnlock}
                  />
                  </Elements>
                )}
              </div>
                <div className="bottom">
                  <h1>{t('Comment')}</h1>
                  <hr />
                  <form onSubmit={(e) => {e.preventDefault();comment() }}>
                    <div className="rating" style={{display:"flex"}}>
                      {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={20}
                        value={formData.rating} 
                        onChange={changeHandler}
                        name='rating'
                        color={star <= (rating) ? "#fdc401" : "#ECECECFF"}
                        style={{ cursor: "pointer", marginRight: 5 }}
                        onClick={() => {
                          setRating(star); 
                          setformData((prev) => ({ ...prev, rating: star })); 
                        }}
                      />
                      ))}
                    </div>
                    <input type="text" name="message" value={formData.message} onChange={changeHandler} id="comment" placeholder={t('share')} />
                    <button type='submit'> {t('save')} </button>
                  </form>
                </div>
                
                <div className="buttomReviews">
                  <h1> {t('AllReviews')} </h1>
                  <hr />
                          {comments.length === 0 ? (
                            <p> {t('NoComment')} </p>
                          ) : (
                            <div className="space-y-4">
                              {comments.map(comment => (
                                <div key={comment.id} className="p-4 rounded-lg shadow-md">
                                  <div className="flex gap-3">
                                    <img src={comment.image || imagePreview} alt="User" className="w-10 h-10 rounded-full" />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold">{comment.fullname}</span>
                                        <span className="text-xs text-gray-400">
                                          {t('gives')} {comment.rating} ⭐
                                        </span>
                                        <span className="text-xs text-gray-400">
                                          {new Date(comment.date).toLocaleString()}
                                        </span>
                                      </div>
                                      
                                      <p className="mt-1 text-sm text-gray-500">{comment.message}</p>

                                      <div className="flex gap-4 mt-2 text-sm text-gray-400">
                                        <button  className="flex items-center gap-1 hover:text-gray-600"
                                          onClick={() => handleReplyClick(comment.id)}>
                                          <FaReply />
                                          {t('Reply')}
                                        </button>
                                        {replies[comment.id]?.length > 0 && (
                                          <button 
                                            className="text-blue-500 hover:underline"
                                            onClick={() => toggleReplies(comment.id)}
                                          >
                                            {showReplies[comment.id] ? 'Hide replies' : `Show replies (${replies[comment.id].length})`}
                                          </button>
                                          
                                        )}
                                      </div>
                                           {/* Reply form */}
                                      {replyingTo === comment.id && (
                                        <div className="mt-3 flex gap-2">
                                          <img src={imagePreview} alt="You" className="w-8 h-8 mt-1 rounded-full" />
                                          <div className="flex-1">
                                            <textarea
                                              className="w-full p-2 border rounded-lg text-sm"
                                              rows="2"
                                              placeholder={t('Write your reply...')}
                                              value={replyText}
                                              onChange={(e) => setReplyText(e.target.value)}
                                            />
                                            <div className="flex justify-end gap-2 mt-1">
                                              <button 
                                                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                                                onClick={() => setReplyingTo(null)}
                                              >
                                               {t('Cancel')}
                                              </button>
                                              <button 
                                                className="px-3 py-1 bg-blue-700 text-white text-sm rounded"
                                                onClick={() => handleReplySubmit(comment.id)}
                                              >
                                                {t('Reply')}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {/* Replies list */}
                                      {showReplies[comment.id] && replies[comment.id]?.length > 0 && (
                                        <div className="mt-3 border-l-2 border-gray-200 pl-4">
                                          {replies[comment.id].map(reply => (
                                            <div key={reply.id} className="flex gap-3 py-3">
                                              <img 
                                                src={reply.image} 
                                                alt="Replier" 
                                                className="w-8 h-8 rounded-full" 
                                              />
                                              <div>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-sm font-semibold">
                                                    {reply.fullname || reply.authorName || 'Anonymous'}
                                                  </span>
                                                  <span className="text-xs text-gray-400">
                                                    {new Date(reply.date).toLocaleString()}
                                                  </span>
                                                </div>
                                                <p className="text-sm text-gray-400">{reply.message}</p>
                                                <div className="flex gap-4 mt-1 text-xs text-gray-400">
                                                  <button className="flex items-center gap-1 hover:text-blue-400">
                                                    <FaThumbsUp size={12} />
                                                  </button>
                                                  <button className="flex items-center gap-1 hover:text-red-400">
                                                    <FaThumbsDown size={12} />
                                                  </button>
                                                  <button  className="flex items-center gap-1 hover:text-gray-600"
                                                  onClick={() => handleReplyClick(comment.id)}>
                                                  <FaReply />
                                                  {t('Reply')}
                                                </button>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                </div>
              </div>

            </div>

            </>
        ):(
            <p>Loading...</p>
        )
    }
    </div>
  )
}

export default Displaycours
