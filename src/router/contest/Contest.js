import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/FeedPost.css";
import MainFeed from "../../component/MainFeed";

import CreateFeedModal from './modals/CreateFeedModal';
import ReactHtmlParser from "react-html-parser";

const Contest = () => {

  const [createFeedModal, setCreateFeedModal] = useState(false);

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
      <div style={{ width: "600px", display: "grid" }}>
        <CreateFeedModal show={createFeedModal}
                                              onHide={()=>{setCreateFeedModal(false)}} />
        <input readOnly style={{border:'none'}} className="my-3 py-3" type="text" size="50" onClick={()=>{setCreateFeedModal(true)}} placeholder="무슨 일이 일어나고 있나요?" />

        {/* {feeds &&
          feeds.length > 0 &&
          feeds.map((feed, index) => (
            <MainFeed key={index} feedData={feed} />
          ))} */}
      </div>
    </div>
  );
};

export default Contest;