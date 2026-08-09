import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaShare, FaSearch, FaPlus, FaTag } from 'react-icons/fa';
import './Discussion.css';

import { fetchApi } from '../../services/api';

export default function Discussion() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await fetchApi('/api/discussions');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch discussions", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (id) => {
    try {
      const res = await fetchApi(`/api/discussions/${id}/like`, { method: 'POST' });
      if (res.ok) {
        setPosts(posts.map(post => {
          if (post.id === id) {
            return {
              ...post,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
              liked: !post.liked
            };
          }
          return post;
        }));
      }
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newTagsList = newTags ? newTags.split(',').map(t => t.trim()) : ['General'];
    
    try {
      const res = await fetchApi('/api/discussions', {
        method: 'POST',
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          tags: newTagsList
        })
      });
      if (res.ok) {
        const newPost = await res.json();
        setPosts([newPost, ...posts]);
        setNewTitle('');
        setNewContent('');
        setNewTags('');
        setShowNewPostModal(false);
      }
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="discussion-container">
      {/* Header Banner */}
      <div className="discussion-hero">
        <div className="discussion-hero-content">
          <h1>Community Discussions</h1>
          <p>Ask questions, share interview experiences, and collaborate with fellow coders.</p>
        </div>
        <button className="create-post-btn" onClick={() => setShowNewPostModal(true)}>
          <FaPlus /> New Discussion
        </button>
      </div>

      {/* Controls Bar */}
      <div className="discussion-controls">
        <div className="search-bar-wrapper">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search discussions, tags, or topics..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Start a New Discussion</h2>
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  placeholder="What's on your mind?" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea 
                  placeholder="Provide details or context..." 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows="4"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. DSA, React, Career" 
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowNewPostModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Post Discussion</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="posts-feed">
        {filteredPosts.length === 0 ? (
          <p className="no-posts">No discussions found matching your search.</p>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="author-info">
                  <div className="author-avatar">{post.avatar}</div>
                  <div>
                    <span className="author-name">{post.author}</span>
                    <span className="post-time">{post.time}</span>
                  </div>
                </div>
              </div>

              <h3 className="post-title">{post.title}</h3>
              <p className="post-content">{post.content}</p>

              <div className="post-tags">
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="tag-pill"><FaTag size={10} /> {tag}</span>
                ))}
              </div>

              <div className="post-footer">
                <button 
                  className={`action-btn ${post.liked ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  <FaHeart /> {post.likes}
                </button>
                <button className="action-btn">
                  <FaComment /> {post.comments} Comments
                </button>
                <button className="action-btn share-btn">
                  <FaShare /> Share
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}