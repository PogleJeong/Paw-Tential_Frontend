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

  // 유저정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost:3000/userInfo', { params: { id: userInfo.id } });
        if (res.data.profile) {
          const profilePicturePath = `http://localhost:3000/${res.data.profile}`;
          setProfilePictureFile(profilePicturePath);
          setPreviewUrl(profilePicturePath);
        } else {
          setProfilePictureFile('default-profile-picture.png');
          setPreviewUrl('default-profile-picture.png');
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserInfo();
  }, [userInfo.id]);


  const toggleDropdown = () => {
    setIsDropdown(!isDropdown);
  };



  return (
    <div className="col-sm-12 py-5">
      <div className="card">
        <div className="card-body profile-page p-5">
          <div className="profile-header">
            <div className="position-relative">
              <div className="user-detail text-center mb-3">
                {/* 프로필 사진 */}
                <div className="profile-img">
                  
                  <img src={previewUrl} alt={id} className="avatar-130 img-fluid" />
                </div>
                <div className="profile-detail">
                  <h3 className="">{id}</h3>
                </div>
              </div>
              <div className="profile-info p-3 d-flex align-items-center justify-content-between position-relative">
  <div className="social-info">
    <ul className="social-data-block d-flex align-items-center justify-content-between list-inline p-0 m-0">
      <FollowCount userId={id} />
    </ul>
    <br/>
      {!isCurrentUser && <FollowButton userId={id} />}
      <br/><br/>
    <p className="bio">{intro}</p>
  </div>
  {/* 드롭다운메뉴 */}
  <ul>
  {userInfo !== '' && (
    <li>
      <a href="#" className="d-flex align-items-center" onClick={toggleDropdown}>
      <i className="ri-settings-4-line mx-5" style={{ fontSize: '24px' }}></i>

      </a>
      {isDropdown && (
        cookies.USER_ID === userInfo.id ? (
          <MyfeedDropdown_user id={userInfo.id} email={userInfo.email} />
        ) : (
          <MyfeedDropdown_others id={userInfo.id} />
        )
      )}
    </li>
  )}
    </ul>
</div>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
  
                    }

export default ProfileCard;

