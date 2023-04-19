import React from 'react';
import PropTypes from 'prop-types';

const CustomLabel = ({ value }) => {
  const words = value.split(' '); // Split the label text into words
  const halfIndex = Math.floor(words.length / 2); // Find the middle index of the words array
  const firstLine = words.slice(0, halfIndex).join(' '); // Join the first half of the words array into a string
  const secondLine = words.slice(halfIndex).join(' '); // Join the second half of the words array into a string

  return words.length < 3 ? (
    <text transform='rotate(-90)' x={50} y={200}>
      {value}
    </text>
  ) : (
    <g transform='rotate(-90, 50, 200)'>
      <text y={180} x={50}>
        {firstLine}
      </text>
      <text y={200} x={50}>
        {secondLine}
      </text>
    </g>
  );
};

CustomLabel.propTypes = {
  value: PropTypes.string
};

export default CustomLabel;
