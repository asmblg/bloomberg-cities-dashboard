import React from 'react';
import numeral from 'numeral';
import { useSpring, animated } from 'react-spring';

const AnimatedNumber = ({ value, type }) => {
  // Ensures only number or string values
  const n =
    typeof value === 'number' ? value : typeof value === 'string' && !isNaN(+value) ? +value : null;
  // Determines toFixed value of displayed number
  const decimalPlaces = n && n % 1 !== 0 ? `${n}`.split('.')[1].length : 0;
  // Creates SpringValue object
  const { number } = useSpring({
    from: { number: 0 },
    number: n || 0,
    delay: 0,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  const formatString = type === 'percent' || type === 'time'
    ? '0.0'
    : type === 'money'
      ? '$0,0'
        : '0,0'
  // If value is not passed in as a string that represents a number or number, nothing with be returned
  return n ? <animated.div>{number.to(num => `${numeral(num.toFixed(decimalPlaces)).format(formatString)}${type === 'percent' ? '%': ''}`)}</animated.div> : null;
};

export default AnimatedNumber;
