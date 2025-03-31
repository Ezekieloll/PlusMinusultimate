// src/Dashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import Filters from './components/Filters';
import MapComponent from './components/MapComponent';
import axios from 'axios';
import { AuthContext } from './AuthContext';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tier1, setTier1] = useState("All");
  const [detailed, setDetailed] = useState("All");
  const [handle, setHandle] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tweetData, setTweetData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the Firebase ID token if user is authenticated
        let token = "";
        if (user) {
          token = await user.getIdToken();
        }
        const params = { tier1, detailed, handle, startDate, endDate };
        const response = await axios.get("http://localhost:5000/api/tweets", {
          params,
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        setTweetData(response.data);
      } catch (error) {
        console.error("Error fetching tweet data:", error);
      }
    };
    fetchData();
  }, [tier1, detailed, handle, startDate, endDate, user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">PlusMinus Tweet Analytics</h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-2">
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
        <div className="w-full md:w-2/3 p-2">
          <MapComponent tweetData={tweetData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
