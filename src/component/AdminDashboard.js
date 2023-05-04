import React from 'react';
import Users from '../router/admin/Users';
import Reports from '../router/admin/Reports';
import QnA from '../router/admin/QnA';
import PetChart from '../router/admin/PetChart';

function AdminDashboard() {
  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-item">
        <Users />
      </div>
      <div className="admin-dashboard-item">
        <Reports />
      </div>
      <div className="admin-dashboard-item">
        <QnA />
      </div>
      <div className="admin-dashboard-item">
        <PetChart />
      </div>
    </div>
  );
}

export default AdminDashboard;
