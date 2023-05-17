import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import QnAModal from './QnAModal';

const MyfeedDropdown_user = ({ id, email }) => {
  const [showQnAModal, setShowQnAModal] = useState(false);

  const handleOpenQnAModal = () => {
    setShowQnAModal(true);
  };

  const handleCloseQnAModal = () => {
    setShowQnAModal(false);
  };

  return (
    <>
      <ul style={{ position: "absolute", backgroundColor: "white", border:"1px solid #ccc" }}>
        <Link to={{ pathname: "/myfeed/User_update", state: { userId: id } }} className="nav-link">
          정보 수정
        </Link>
        <Link to={{ pathname: "/myfeed/pet_update", state: { userId: id } }} className="nav-link" onClick={handleOpenQnAModal}>
          펫 정보 수정
        </Link>
        <Link to="#" className="nav-link" onClick={handleOpenQnAModal}>
          문의
        </Link>
      </ul>

      {showQnAModal && <QnAModal show={showQnAModal} onClose={handleCloseQnAModal} id={id} email={email} />}
    </>
  );
};

export default MyfeedDropdown_user;
