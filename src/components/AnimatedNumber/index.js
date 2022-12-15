import React from 'react';
import { useSpring, animated } from 'react-spring';

const AnimatedNumber = ({ value }) => {
  // Ensures only number or string values
  const n =
    typeof value === 'number' ? value : typeof value === 'string' && !isNaN(+value) ? +value : null;
  // Determines toFixed value of displayed number
  const decimalPlaces = n && n % 1 !== 0 ? `${n}`.split('.')[1].length : 0;
  // Creates SpringValue object
  const { number } = useSpring({
    from: { number: 0 },
    number: n || 0,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 }
  });
  // If value is not passed in as a string that represents a number or number, nothing with be returned
  return n ? <animated.div>{number.to(num => num.toFixed(decimalPlaces))}</animated.div> : null;
};

export default AnimatedNumber;
