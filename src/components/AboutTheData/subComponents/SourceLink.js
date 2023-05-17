import React from 'react';
import PropTypes from 'prop-types';

import '../style.css';

const SourceLink = ({ source, link1, link2 }) => {
  if (source && link1 && !link2) {
    return (
      <a className='source-link' href={link1} target='_blank' rel='noreferrer'>
        {source}
      </a>
    );
  } else if (source && link1 && link2) {
    const [source1, source2] = source.split(',');

    return (
      <div>
        <a className='source-link' href={link1} target='_blank' rel='noreferrer'>
          {source1.trim()}
        </a>
        {', '}
        <a className='source-link' href={link2} target='_blank' rel='noreferrer'>
          {source2.trim()}
        </a>
      </div>
    );
  } else {
    return null;
  }
};

SourceLink.propTypes = {
  source: PropTypes.string,
  link1: PropTypes.string,
  link2: PropTypes.string
};

export default SourceLink;
