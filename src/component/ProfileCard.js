import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FollowCount from './FollowCount';
import FollowButton from './FollowButton';
import { useCookies } from 'react-cookie';
import MyfeedDropdown_user from './MyfeedDropdown_user';
import MyfeedDropdown_others from './MyfeedDropdown_others';

const ProfileCard = ({ userInfo }) => {
  const [cookies, setCookies] = useCookies(['USER_ID', 'USER_NICKNAME']);
  const { id,  intro } = userInfo;
  const [isDropdown, setIsDropdown] = useState(false);

  const isCurrentUser = cookies.USER_ID === id;

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost:3000/userInfo', { params: { id: userInfo.id } });
        if (res.data.profile) {
          const profilePicturePath = `http://localhost:3000/${res.data.profile}`;
          setProfilePictureFile(profilePicturePath);
          setPreviewUrl(profilePicturePath);
        } else {
          // Set a default profile picture URL for users without a profile picture
          setProfilePictureFile('default-profile-picture.png');
          setPreviewUrl('default-profile-picture.png');
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserInfo();
  }, [userInfo.id]);

  return (
    <div className="profile-card">
      <img className="profile-image" src={previewUrl} alt={id} />
      <div className="profile-info">
        <h1>{id}</h1>
        <p className="bio">{intro}</p>
        <FollowCount userId={id} />
        {!isCurrentUser && <FollowButton userId={id} />}
        {userInfo !== '' && (
          <div className="feed-icon" style={{ float: 'right' }}>
            <img
              src="feedimages/icon.png"
              alt="더보기"
              onClick={() => setIsDropdown(!isDropdown)}
            />
            {cookies.USER_ID === userInfo.id ? (
              isDropdown && <MyfeedDropdown_user id={userInfo.id} email={userInfo.email} />
            ) : (
              isDropdown && <MyfeedDropdown_others id={userInfo.id} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
