import React from 'react';
import { connect } from 'react-redux';

import ISS from 'assets/ISS.png';

const Globe = ({ small }) => (
  <div className={`globe globe--start`}>
    <div className="globe-crop">
      <div className="globe-map" />
    </div>
  </div>
);

export default Globe;
