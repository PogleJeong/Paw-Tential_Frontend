import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegComment, FaShareSquare } from 'react-icons/fa';



function MyFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div className="my-feed">
      <div className="feed-header">
        <h1>My Feed</h1>
      </div>
      <div className="post-list">
        {posts.map(post => (
          <div className="post" key={post.id}>
            <div className="post-header">
              <img src={post.author.profilePicture} alt={post.author.username} />

              <div className="author-info">
                <h2>{post.author.username}</h2>
                <p>{post.createdDate}</p>
              </div>
            </div>
            <div className="post-content">
              <img src={post.imageUrl} alt={post.caption} />
              <p>{post.caption}</p>
            </div>
            <div className="post-actions">
              <button><FaHeart /></button>
              <button><FaRegComment /></button>
              <button><FaShareSquare /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyFeed;