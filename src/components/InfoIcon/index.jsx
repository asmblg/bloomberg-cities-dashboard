import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {useLocation} from 'react-router-dom';

import SourceLink from '../SourceLink';

import './style.css';

const InfoIcon = ({ config, popup, onClick }) => {
  const location = useLocation();
  const smallScreen = window.innerWidth < 768;
  const query = new URLSearchParams(location.search);
  const lang = query.get('lng') || null;
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target) && 
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

 return popup && (config?.Description || config?.Source) ? (
    <div className='info-icon-wrapper'>
      <i 
        ref={triggerRef}
        className='info circle icon info-icon'
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => !smallScreen && setIsOpen(true)}
        onMouseLeave={() => !smallScreen && setIsOpen(false)}
      />
      {isOpen && (
        <div 
          ref={popupRef}
          className='info-icon-popup-container'
          onMouseEnter={() => !smallScreen && setIsOpen(true)}
          onMouseLeave={() => !smallScreen && setIsOpen(false)}
        >
          {config?.Description ? <h5 className='info-icon-popup-text'>{config.Description}</h5> : null}

          {config?.Geography ? (
            <div className='info-icon-text-container'>
              <h5 className='info-icon-popup-text'>
                <span style={{
                fontFamily: 'var(--font-family-bold)'
              }}>{lang === 'pt' ? 'Geografia:': 'Geography:'}</span> {config?.Geography}</h5>
            </div>
          ) : null}
          {config?.Source ? (
            <div className='info-icon-text-container' style={{ marginBottom: '0' }}>
              <h5 className='info-icon-popup-text'>
              <span style={{
                fontFamily: 'var(--font-family-bold)' 
              }}>{lang === 'pt' ? 'Fonte:' :'Source:'}</span> <SourceLink
                source={config.Source || null}
                link1={config.Source_link || null}
                link2={config.Source_link_2 || null}
              /></h5>
            </div>
          ) : null}
        </div>
      )}
    </div>
  ) : (
    <div onClick={() => (onClick ? onClick() : null)}>
      <i className='info circle icon info-icon' />
    </div>
  );
}
InfoIcon.propTypes = {
  config: PropTypes.object,
  popup: PropTypes.bool,
  onClick: PropTypes.func
};

export default InfoIcon;
