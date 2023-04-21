import React, { useState, useEffect } from 'react';

function MyFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div>
      <h1>My Feed</h1>
      {/* posts 상태값을 사용하여 게시물 리스트를 렌더링하는 코드를 작성하세요 */}
    </div>
  );
}

export default MyFeed;
