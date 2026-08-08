import React, { useState } from 'react';
import { FaHeart, FaComment, FaShare, FaSearch, FaPlus, FaTag } from 'react-icons/fa';
import './Discussion.css';

const initialPosts = [
  {
    id: 1,
    author: 'DevQueen',
    avatar: 'DQ',
    time: '2 hours ago',
    title: 'How to master the Sliding Window pattern for coding interviews?',
    content: 'I have been struggling a bit with identifying when to use a fixed vs. dynamic sliding window. Any tips or problem recommendations on LeetCode to practice?',
    tags: ['DSA', 'Interviews', 'SlidingWindow'],
    likes: 24,
    comments: 8,
    liked: false
  },
  {
    id: 2,
    author: 'SyntaxError',
    avatar: 'SE',
    time: '5 hours ago',
    title: 'PromptWars Hyderabad - Anyone participating next month?',
    content: 'Just registered for the upcoming vibe-coding hackathon in Hyderabad! Let me know if anyone wants to team up or discuss ideas.',
    tags: ['Hackathon', 'AI', 'VibeCoding'],
    likes: 42,
    comments: 15,
    liked: true
  }
];

export default function Discussion() {
  const [posts, setPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const handleLike = (id) => {
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
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPostObj = {
      id: posts.length + 1,
      author: 'Coder',
      avatar: 'C',
      time: 'Just now',
      title: newTitle,
      content: newContent,
      tags: newTags ? newTags.split(',').map(t => t.trim()) : ['General'],
      likes: 0,
      comments: 0,
      liked: false
    };

    setPosts([newPostObj, ...posts]);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setShowNewPostModal(false);
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