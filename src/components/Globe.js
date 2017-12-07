import React from 'react';

const Globe = props => (
  <div className="globe">
    <div
      className="globe-map"
      style={{ transform: `translateX(${props.x}%)` }}
    />
    <div
      className="globe-marker"
      style={{ transform: `transform:translateY(${props.y}%)` }}
    />
  </div>
);

export default Globe;
