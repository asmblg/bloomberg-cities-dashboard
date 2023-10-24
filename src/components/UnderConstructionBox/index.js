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
      <h4 style={{ ...textStyle, marginBottom: '20px' }}>{'CURRENTLY UNDER DEVELOPMENT'}</h4>
      <h4 style={textStyle}>{'AVAILABLE SOON'}</h4>
    </div>
  );
};

UnderConstructionBox.propTypes = {
  notInConfig: PropTypes.bool
};

export default UnderConstructionBox;
