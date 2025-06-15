import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBook, FaCheck, FaEllipsisV, FaSort, FaStar, FaTimes, FaUser } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import './CSS/approve.css';
const CommentApprove = () => {
    const [comments, setComments] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
    // Fetch comments from API
// Fetch comments from API
useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const endpoint = filter === 'pending' 
          ? 'http://localhost:9000/api/v2/pending' 
          : 'http://localhost:9000/api/v2/approveComment';
        
        // Use axios consistently for all requests
        const response = await axios.get(endpoint);
        
        // Fetch full names and formation for each comment using axios
        const commentsWithFullnameAndFormation = await Promise.all(
            response.data.map(async (comment) => {
              let fullname = 'User';
              let formation = null;
          
              try {
                const fullnameResponse = await axios.get(
                  `http://localhost:9000/api/v2/GetNameApprenant/${comment.id}`
                );
                fullname = fullnameResponse.data || 'User';
              } catch (error) {
                console.error("Error fetching author name:", error);
              }
          
              try {
                const formationResponse = await axios.get(
                  `http://localhost:9000/api/v2/formation/${comment.id}`
                );
                formation = formationResponse.data || null;
              } catch (error) {
                console.error("Error fetching formation:", error);
              }
          
              return {
                ...comment,
                fullname,
                formation // This will be the full Formations object
              };
            })
          );
          
        
        setComments(commentsWithFullnameAndFormation);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [filter]);
  
    // Handle row selection
    const toggleSelect = (id) => {
      setSelected(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id) 
          : [...prev, id]
      );
    };
  
    // Handle bulk selection
    const toggleSelectAll = () => {
      if (selected.length === comments.length) {
        setSelected([]);
      } else {
        setSelected(comments.map(comment => comment.id));
      }
    };
  
    // Handle sorting
    const requestSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };
  
    // Sort comments
    const sortedComments = React.useMemo(() => {
      let sortableItems = [...comments];
      if (sortConfig.key) {
        sortableItems.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      return sortableItems;
    }, [comments, sortConfig]);
  
    // Approve comment
    const approveComment = async (commentId) => {
      try {
        await axios.put(`http://localhost:9000/api/v2/${commentId}/approve`);
        setComments(comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, status: 'APPROVED' } 
            : comment
        ));
        toast.success("Comment approved successfully");
      } catch (error) {
        toast.error("Failed to approve comment");
      }
    };
  
    // Reject comment
    const rejectComment = async (commentId) => {
      try {
        await axios.put(`http://localhost:9000/api/v2/${commentId}/reject`);
        setComments(comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, status: 'REJECTED' } 
            : comment
        ));
        toast.success("Comment rejected");
      } catch (error) {
        toast.error("Failed to reject comment");
      }
    };
  
    // Bulk approve
    const bulkApprove = async () => {
      try {
        await Promise.all(selected.map(id => 
          axios.put(`http://localhost:9000/api/v2/${id}/approve`)
        ));
        setComments(comments.map(comment => 
          selected.includes(comment.id) 
            ? { ...comment, status: 'APPROVED' } 
            : comment
        ));
        setSelected([]);
        toast.success(`${selected.length} comments approved`);
      } catch (error) {
        toast.error("Failed to approve comments");
      }
    };
  
    // Bulk reject
    const bulkReject = async () => {
      try {
        await Promise.all(selected.map(id => 
          axios.put(`http://localhost:9000/api/v2/${id}/reject`)
        ));
        setComments(comments.map(comment => 
          selected.includes(comment.id) 
            ? { ...comment, status: 'REJECTED' } 
            : comment
        ));
        setSelected([]);
        toast.success(`${selected.length} comments rejected`);
      } catch (error) {
        toast.error("Failed to reject comments");
      }
    };
  
    // Format date
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
  
    return (
      <div className="p-4 sm:ml-64 admin-comments-container">
        <ToastContainer/>
        <div className=" p-4 rounded-lg admin-header">
          <h1>Comment Moderation</h1>
          <div className="filter-controls">
            <button 
              className={filter === 'pending' ? 'active' : ''}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={filter === 'approved' ? 'active' : ''}
              onClick={() => setFilter('approved')}
            >
              Approved
            </button>
          </div>
        </div>
  
        {selected.length > 0 && (
          <div className="bulk-actions">
            <span>{selected.length} selected</span>
            <button onClick={bulkApprove}>Approve Selected</button>
            <button onClick={bulkReject}>Reject Selected</button>
            <button onClick={() => setSelected([])}>Clear</button>
          </div>
        )}
  
        <div className="comments-table-container">
          {loading ? (
            <div className="loading">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="empty-state">
              <p>No {filter} comments found</p>
            </div>
          ) : (
            <table className="comments-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      checked={selected.length === comments.length && comments.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th onClick={() => requestSort('message')}>
                    Comment <FaSort />
                  </th>
                  <th onClick={() => requestSort('fullname')}>
                    Author <FaSort />
                  </th>
                  <th onClick={() => requestSort('formation.titleEn')}>
                    Course <FaSort />
                  </th>
                  <th onClick={() => requestSort('rating')}>
                    Rating <FaSort />
                  </th>
                  <th onClick={() => requestSort('date')}>
                    Date <FaSort />
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedComments.map(comment => (
                  <tr 
                    key={comment.id} 
                    className={selected.includes(comment.id) ? 'selected' : ''}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(comment.id)}
                        onChange={() => toggleSelect(comment.id)}
                      />
                    </td>
                    <td className="comment-content">
                      <div className="comment-text">{comment.message}</div>
                    </td>
                    <td>
                      <div className="user-info">
                        <FaUser className="user-icon" />
                        <span>{comment.fullname || 'Unknown'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="course-info">
                        <FaBook className="course-icon" />
                        <span>{comment.formation?.titleEn || 'No course'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            color={i < (comment.rating || 0) ? '#FFD700' : '#E0E0E0'} 
                          />
                        ))}
                      </div>
                    </td>
                    <td>{formatDate(comment.date)}</td>
                    <td>
                      <span className={`status-badge ${comment.status.toLowerCase()}`}>
                        {comment.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {comment.status === 'PENDING' && (
                          <>
                            <button 
                              className="approve-btn"
                              onClick={() => approveComment(comment.id)}
                            >
                              <FaCheck />
                            </button>
                            <button 
                              className="reject-btn"
                              onClick={() => rejectComment(comment.id)}
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };
export default CommentApprove
