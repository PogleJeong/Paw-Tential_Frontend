import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
            <Link to="/admin/admin" className="nav-link">
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
                <Link to="/admin/Data" className="nav-link">
                  데이터 관리
                </Link>
              </li>

        </ul>
      </div>
    </nav>
  );
};

export default AdminSidebar;
