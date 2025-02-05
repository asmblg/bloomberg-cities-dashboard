import React from 'react';
import PropTypes from 'prop-types';

const UnderConstructionBox = ({ notInConfig }) => {
  const textStyle = {
    fontFamily: 'RobotoBlack',
    opacity: '0.7',
    textAlign: 'center'
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: notInConfig ? '200px' : '100%',
        backgroundColor: '#F5F7F8',
        padding: '20px',
        margin: notInConfig ? '0 20px' : '0'
      }}
    >
      <h5 style={{ ...textStyle, marginBottom: '5px' }}>{'CURRENTLY UNDER DEVELOPMENT'}</h5>
      <h5 style={textStyle}>{'AVAILABLE SOON'}</h5>
    </div>
  );
};

UnderConstructionBox.propTypes = {
  notInConfig: PropTypes.bool
};

export default UnderConstructionBox;
