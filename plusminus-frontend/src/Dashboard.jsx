import React, { useState, useEffect, useContext } from 'react';
import Filters from './components/Filters';
import MapComponent from './components/MapComponent';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import './Dashboard.css';
import { FiLogOut, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Legend from './components/Legend';

function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const [tier1, setTier1] = useState("All");
  const [detailed, setDetailed] = useState("All");
  const [handle, setHandle] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tweetData, setTweetData] = useState([]);
  const [useHeatmap, setUseHeatmap] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "";
        if (user) {
          token = await user.getIdToken();
        }
        const params = { tier1, detailed, handle, startDate, endDate };
        const response = await axios.get("http://localhost:5000/api/tweets", {
          params,
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });

        if (Array.isArray(response.data)) {
          setTweetData(response.data);
        } else {
          setTweetData([]);
        }
      } catch (error) {
        console.error("Error fetching tweet data:", error);
      }
    };
    fetchData();
  }, [tier1, detailed, handle, startDate, endDate, user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="dashboard-wrapper">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-left">
          <img
            src="/PlusMinus__1_-removebg-preview.png"
            alt="Logo"
            className="logo-image"
            style={{ marginRight: '1px', width: '90px', height: '90px', marginTop: "20px" }}
          />
          <span className="navbar-title">PlusMinus Tweet Analytics</span>
        </div>

        <div className="navbar-right">
          <button className="theme-toggle" onClick={toggleDarkMode} title="Toggle Theme">
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          <span className="user-email"><FiUser style={{ marginRight: '6px' }} />{user?.email}</span>
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut style={{ marginRight: '6px' }} />Logout
          </button>
        </div>
      </nav>

      {/* MAIN DASHBOARD */}
      <div className="dashboard-content">
        <div className="filters-panel slide-in-left">
          <Filters
            tier1={tier1}
            setTier1={setTier1}
            detailed={detailed}
            setDetailed={setDetailed}
            handle={handle}
            setHandle={setHandle}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
        <div className="map-panel slide-in-right">
          <MapComponent tweetData={tweetData} selectedTier1={tier1} useHeatmap={useHeatmap} />
          <Legend />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
