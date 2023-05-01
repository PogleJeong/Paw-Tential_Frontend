import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'react-feather';

import '../styles/admin.css';

/**
 * 
 * @returns 관리자 페이지 사이드바
 */

const AdminSidebar = () => {
  const [showDataSubMenu, setShowDataSubMenu] = useState(false);

  useEffect(() => {
    setShowDataSubMenu(false);
  }, []);

  const toggleDataSubMenu = () => {
    setShowDataSubMenu(!showDataSubMenu);
  };

  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/admin/dashboard" className="nav-link">
              대시보드
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/users" className="nav-link">
              사용자 관리
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/reports" className="nav-link">
              신고 관리
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/QnA" className="nav-link">
              문의 관리
            </Link>
          </li>
          <li className="nav-item">
            <div
              className="nav-link"
              onClick={toggleDataSubMenu}
              role="button"
              tabIndex={0}
            >
              데이터 관리
              <ChevronRight className={`chevron ${showDataSubMenu ? 'down' : 'up'}`} />
            </div>
            <ul className={`nav flex-column sub-menu ${showDataSubMenu ? 'show' : ''}`}>
            
              <li className="nav-item">
                <Link to="/admin/PetChart" className="nav-link">
                  반려견 카테고리
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/UserChart" className="nav-link">
                  유저 정보
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminSidebar;
