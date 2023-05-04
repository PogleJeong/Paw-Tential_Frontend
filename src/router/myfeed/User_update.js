import React, { useState } from "react";

function EditProfile(props) {
  const [pwd, setPwd] = useState(props.member.pwd);
  const [phone, setPhone] = useState(props.member.phone);
  const [profile, setProfile] = useState("");
  const [intro, setIntro] = useState(props.member.intro);

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
    formData.append("id", props.member.id);
    formData.append("pwd", pwd);
    formData.append("phone", phone);
    formData.append("profile", profile);
    formData.append("intro", intro);

    fetch("/api/editProfile", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
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
        <div>
          <label htmlFor="profile">프로필 이미지</label>
          <input type="file" id="profile" name="profile" onChange={handleChangeProfile} />
        </div>
        <div>
          <label htmlFor="intro">자기소개</label>
          <textarea
            id="intro"
            name="intro"
            value={intro}
            onChange={handleChangeIntro}
          />
        </div>
        <button type="submit">수정</button>
      </form>
    </div>
  );
}

export default EditProfile;