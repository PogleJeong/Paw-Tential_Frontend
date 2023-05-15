import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import ReportModal from './ReportModal';

const MyfeedDropdown_others = ({ id }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [cookies, setCookies] = useCookies(['USER_ID']);

  const handleOpenReportModal = () => {
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  return (
    <>
      <ul style={{ position: "absolute", backgroundColor: "white" }}>
        <li>차단</li>
        <Link to='#' className="nav-link" onClick={handleOpenReportModal}>
            신고
      </Link>
      </ul>

      {showReportModal && <ReportModal show={showReportModal} onClose={handleCloseReportModal} id={id} userId={cookies.USER_ID} type={1} />}
    </>
  );
};

export default MyfeedDropdown_others;
