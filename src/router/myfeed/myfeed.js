import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegComment, FaShareSquare } from 'react-icons/fa';



function MyFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

const Myfeed = () => {
    return (
        <div>
        <h1>Myfeed</h1>
        </div>
    )
}

export default Myfeed;