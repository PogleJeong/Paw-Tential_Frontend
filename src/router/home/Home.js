import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/FeedPost.css";
import HomeFeed from "../../component/HomeFeed";

const Home = () => {
  const [feeds, setFeeds] = useState([]);
  const [comments, setComments] = useState([]);
  const [images, setImages] = useState([]);

//content
  const fetchFeeds = async () => {
    try {
      const response = await axios.get("http://localhost:3000/mainFeed");
      setFeeds(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch feeds");
    }
  };

//comment
  const fetchComments = async (seq) => {
    try {
      const response = await axios.get(`http://localhost:3000/${seq}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch comments");
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return (
    <div>
      <p style={{ textAlign: "center" }}>Welcome to faw-tential</p>
      <div style={{ width: "440px", display: "grid" }}>
        {feeds &&
          feeds.length > 0 &&
          feeds.map((feed, index) => (
            <HomeFeed key={index} feedData={feed} />
          ))}
      </div>
    </div>
  );
};

export default Home;