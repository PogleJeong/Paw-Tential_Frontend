import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalUsers: 0,
      totalPosts: 0,
      totalComments: 0,
      isLoading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    axios
      .get("/api/admin/dashboard")
      .then((res) => {
        const { totalUsers, totalPosts, totalComments } = res.data;
        this.setState({
          totalUsers,
          totalPosts,
          totalComments,
          isLoading: false,
          error: null,
        });
      })
      .catch((err) => {
        this.setState({
          error: "Error occurred while fetching data",
          isLoading: false,
        });
      });
  }

  render() {
    const { totalUsers, totalPosts, totalComments, isLoading, error } =
      this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <div className="admin-dashboard">
        <div className="card mb-3">
          <div className="card-header">Dashboard</div>
          <div className="card-body">
            <h5 className="card-title">Total Users: {totalUsers}</h5>
            <p className="card-text">
              <Link to="/admin/users">View Users</Link>
            </p>
          </div>
        </div>
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Total Posts: {totalPosts}</h5>
            <p className="card-text">
              <Link to="/admin/posts">View Posts</Link>
            </p>
          </div>
        </div>
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Total Comments: {totalComments}</h5>
            <p className="card-text">
              <Link to="/admin/comments">View Comments</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminDashboard;
