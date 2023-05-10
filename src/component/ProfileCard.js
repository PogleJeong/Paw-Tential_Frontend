import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FollowCount from './FollowCount';
import FollowButton from './FollowButton';
import IsFollowing from './IsFollowing';
import { useCookies } from "react-cookie";
import MyfeedDropdown_user from './MyfeedDropdown_user';
import MyfeedDropdown_others from './MyfeedDropdown_others';


const ProfileCard = ({ userInfo }) => {
  const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
  const { id, profile, intro } = userInfo;
  const [isDropdown, setIsDropdown] = useState(false);

  const isCurrentUser = cookies.USER_ID === id;


  return (
    <div className="profile-card">
      <img className="profile-image" src={profile} alt={id} />
      <div className="profile-info">
        <h1>{id}</h1>
        <p className="bio">{intro}</p>
        {<FollowCount userId={id} />}
        {!isCurrentUser && <IsFollowing followerId={cookies.USER_ID} followingId={id} />}
        {!isCurrentUser && <FollowButton userId={id} />}
        {userInfo !== '' && (
            <div className="feed-icon" style={{ float: "right" }}>
              <img
                src="feedimages/icon.png"
                alt="더보기"
                onClick={() => setIsDropdown(!isDropdown)}
              />
              {cookies.USER_ID === userInfo.id ? (
                isDropdown && <MyfeedDropdown_user id={userInfo.id} />
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
