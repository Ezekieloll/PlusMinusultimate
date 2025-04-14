import React, { useEffect } from 'react';

const tier1Options = ["All", "Crime-related", "Achievement-based", "Neutral"];
const handleOptions = ["All", "IndiaToday", "ZeeNewsEnglish", "timesofindia", "htTweets", "NDTV"];

const detailedMapping = {
  "Crime-related": ["All", "Murder", "Robbery", "Rape", "Assault", "Theft", "Fraud", "Kidnapping"],
  "Achievement-based": ["All", "Award won", "Innovation", "Record", "Milestone", "Discovery", "Recognition"],
  "Neutral": ["All", "None"]
};

function Filters({
  tier1, setTier1,
  detailed, setDetailed,
  handle, setHandle,
  startDate, setStartDate,
  endDate, setEndDate,
  fetchFilteredTweets,
  isLoading
}) {
  useEffect(() => {
    // Only reset detailed if switching between Crime/Achievement categories
    if (tier1 === "Crime-related" || tier1 === "Achievement-based") {
      setDetailed("All");
    }
  }, [tier1, setDetailed]);

  let computedDetailedOptions = ["All"];
  if (tier1 !== "All") {
    computedDetailedOptions = detailedMapping[tier1] || ["All"];
  }



  return (
    <div className="filter-container">
      <h2 className="filter-header">Filter Tweets</h2>

      <div className="filter-group">
    <label>Tier 1 Category</label>
    <select 
      value={tier1} 
      onChange={(e) => setTier1(e.target.value)}
      disabled={isLoading}
    >
      {tier1Options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
</div>

      <div className="filter-group">
        <label>Detailed Category</label>
        <select 
          value={detailed} 
          onChange={(e) => setDetailed(e.target.value)}
          disabled={isLoading || tier1 === "All"}
        >
          {computedDetailedOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>News Channel</label>
        <select 
          value={handle} 
          onChange={(e) => setHandle(e.target.value)}
          disabled={isLoading}
        >
          {handleOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Start Date</label>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="filter-group">
        <label>End Date</label>
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)}
          disabled={isLoading}
        />
      </div>

     
    </div>
  );
}

export default Filters;