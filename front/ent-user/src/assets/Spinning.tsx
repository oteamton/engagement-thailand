import React from 'react';
import './Spinner.css'; // make sure to create a CSS file for styles

// This is a simple functional component with no props
const Spinner: React.FC = () => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner">
      </div>
    </div>
  );
};

export default Spinner;
