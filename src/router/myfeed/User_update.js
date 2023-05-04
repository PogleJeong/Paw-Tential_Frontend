import React, { useState, useEffect } from "react";
import Session from "react-session-api";
import axios from "axios";

function User_update(props) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pwd, setPwd] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState("");
  const [intro, setIntro] = useState("");

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const id = Session.get("user");
      const res = await axios.get("http://localhost:3000/userInfo", {
        params: { id: id },
      });
      setUserInfo(res.data);
      console.log(res.data);
      // 유저 정보를 가져와서 input 요소의 기본값 설정
      setProfile(res.data.profile);
      setPhone(res.data.phone);
      setIntro(res.data.intro);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePwd = (event) => {
    setPwd(event.target.value);
  };

  const handleChangePhone = (event) => {
    setPhone(event.target.value);
  };

  const handleChangeProfile = (event) => {
    setProfile(event.target.files[0]);
  };

  const handleChangeIntro = (event) => {
    setIntro(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", userInfo.id);
    formData.append("pwd", pwd);
    formData.append("phone", phone);
    formData.append("profile", profile);
    formData.append("intro", intro);

    axios
      .post("/api/editProfile", formData)
      .then((res) => {
        if (res.status === 200) {
          props.onClose();
          props.onUpdate();
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="profile">프로필 이미지</label>
          <input
            type="file"
            id="profile"
            name="profile"
            onChange={handleChangeProfile}
          />
        </div>
        <div>
          <label htmlFor="pwd">비밀번호</label>
          <input
            type="password"
            id="pwd"
            name="pwd"
            value={pwd}
            onChange={handleChangePwd}
          />
        </div>
        <div>
          <label htmlFor="phone">전화번호</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={phone}
            onChange={handleChangePhone}
          />
        </div>
        
        <button type="submit">수정</button>
      </form>
    </div>
  );
}

export default User_update;
