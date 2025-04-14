import React from 'react';

function Legend({ useHeatmap }) {
  const legendItems = useHeatmap
    ? [{ color: 'red', label: 'Heatmap' }]  // Heatmap legend
    : [
        { color: 'red', label: 'Negative / Crime-related' },
        { color: 'blue', label: 'Positive' },
        { color: 'purple', label: 'Neutral' },
      ];

  const iconPaths = {
    red: '/marker-icon-2x-red.png',
    blue: '/marker-icon-2x-blue.png',
    purple: '/marker-icon-2x-violet.png',
  };

  return (
    <div className="legend-box">
      <h3 className="legend-title">Legend</h3>
      <ul className="legend-list">
        {legendItems.map((item) => (
          <li key={item.color} className="legend-item">
            <img
              src={iconPaths[item.color]}
              alt={`${item.color} icon`}
              className="legend-icon"
              style={{ width: '25px', height: '41px', marginRight: '8px' }}
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Legend;
