// src/components/Filters.jsx
import React from 'react';

const tier1Options = ["All", "Crime-related", "Achievement-based", "Neutral"];

// Define detailed options for each Tier 1 category
const detailedMapping = {
  "Crime-related": ["Murder", "Robbery", "Rape", "Assault", "Theft", "Fraud", "Kidnapping"],
  "Achievement-based": ["Award won", "Innovation", "Record", "Milestone", "Discovery", "Recognition"],
  "Neutral": ["Neutral"]
};

const handleOptions = ["All", "IndiaToday", "ZeeNewsEnglish", "timesofindia", "htTweets","NDTV"];

function Filters({
  tier1,
  setTier1,
  detailed,
  setDetailed,
  handle,
  setHandle,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) {
  // Compute detailed options based on the selected Tier 1 category
  let computedDetailedOptions = ["All"];
  if (tier1 === "Crime-related") {
    computedDetailedOptions = ["All", ...detailedMapping["Crime-related"]];
  } else if (tier1 === "Achievement-based") {
    computedDetailedOptions = ["All", ...detailedMapping["Achievement-based"]];
  } else if (tier1 === "Neutral") {
    computedDetailedOptions = ["All", ...detailedMapping["Neutral"]];
  }
  
  return (
    <div className="flex flex-col space-y-4">
      {/* Tier 1 Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tier 1 Category
        </label>
        <select
          value={tier1}
          onChange={(e) => {
            setTier1(e.target.value);
            // Reset detailed to "All" when tier1 changes
            setDetailed("All");
          }}
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          {tier1Options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Detailed Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Category
        </label>
        <select
          value={detailed}
          onChange={(e) => setDetailed(e.target.value)}
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          {computedDetailedOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Handle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          News Channel (Handle)
        </label>
        <select
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          {handleOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
    </div>
  );
}

export default Filters;
