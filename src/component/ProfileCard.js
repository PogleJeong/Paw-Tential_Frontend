import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";


import "../styles/Profile.css";

Modal.setAppElement("#root");

const ProfileCard = ({ userInfo, setUserInfo, feed }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalImageUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const res = await axios.post("http://localhost:3000/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = res.data.url;
      const userData = { ...userInfo, profile: imageUrl };
      await axios.put(`http://localhost:3000/users/${userInfo.id}`, userData);
  
      setUserInfo(userData);
    } catch (err) {
      console.log(err);
    } finally {
      handleModalClose();
    }
  };

  const handleModalImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="my-feed-container">
      {userInfo && (
        <div className="profile-card">
          <img
            className="profile-image"
            src={previewImage || userInfo.profile}
            alt={userInfo.id}
          />
          <div className="profile-info">
            <h1>{userInfo.id}</h1>
            <p className="bio">{userInfo.intro}</p>
          </div>
        </div>
      )}
      <div className="feed-container">
        {feed.map((item) => (
          <div key={item.id} className="feed">
            <img src={item.image} alt={item.description} />
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Profile Image Modal"
      >
        <h2>Change Profile Image</h2>
        <input type="file" accept="image/*" onChange={handleModalImageChange} />
        <button onClick={handleModalImageUpload}>Upload</button>
      </Modal>
    </div>
  );
};

export default ProfileCard;
