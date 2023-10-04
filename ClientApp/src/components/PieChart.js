import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const PieChart = ({ percentage }) => {
  return (
    <div style={{ width: '100px', height: '100px' }}>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          textColor: '#000',
          pathColor: '#ff5722',
          trailColor: '#d6d6d6',
        })}
      />
    </div>
  );
};

export default PieChart;
