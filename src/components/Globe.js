import React from 'react';

const Globe = props => (
  <div className="globe">
    <div
      className="globe-map"
      style={{ transform: `translateX(${props.horizontal}%)` }}
    />
    <div
      className="globe-marker"
      style={{ transform: `transform:translateY(${props.vertical}%)` }}
    />
  </div>
);

export default Globe;
