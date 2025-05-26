import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import SourceLink from '../SourceLink';

import { handleScroll } from './utils';
import './style.css';

const AboutTheData = ({ config, project, viewType, infoIconConfig }) => {
  return (
    <div className='about-data-container'>
      <div className='about-data-header'>
        {!config?.noTitle &&
          <h1
            className='about-data-title'
            style={{ color: infoIconConfig?.aboutDataTitleColor || 'var(--black-color)' }}
          >
            {infoIconConfig?.title
              ? infoIconConfig.title.toUpperCase()
              : config?.title
                ? config.title.toUpperCase()
                : 'ABOUT THE DATA'}
          </h1>
        }
        {!config?.noBackButton && <a
          className='about-back-link'
          href={infoIconConfig?.tab ? `/${project}/${infoIconConfig.tab}` : `/${project}`}
        >
          <h5>{'BACK TO DASHBOARD'}</h5>
          <div>
            <Icon size={viewType !== 'mobile' ? 'large' : 'small'} name='close' />
          </div>
        </a>}
      </div>
      {config?.variableTable?.headerRow?.[0] && config.variableTable.variables?.[0] ? (
        <div className='about-table-container'>
          <div className='about-table-header-container'>
            {config.variableTable.headerRow.map((row, i) => (
              <div 
                role='table' key={`table-header-${row.key}-${i}`}
                style={{
                  width: row.wide ? '50%': null,
                }}
              >
                {row.text}
              </div>
            ))}
          </div>
          <div role='table' className='about-table-vars-container' onScroll={() => handleScroll()}>
            <div className='about-table'>
              {config.variableTable.variables
                .filter(({ Tab }) => (infoIconConfig?.tab ? infoIconConfig.tab === Tab : true))
                .map((variable, i) => (
                  <div 
                  
                  key={`variable-row-${i}`} className='about-table-row'>
                    {config.variableTable.headerRow.map((obj, ii) => (
                      <div
                        key={`variable-${i}-data-${ii}`}
                        style={obj.key === 'Variable' || obj.key === 'Tab'
                          ? { 
                              fontFamily: 'RobotoBold',
                              width: obj.wide ? '50%' : null, 
                            } 
                          : {
                              width: obj.wide ? '50%' : null,
                          }}
                      >
                        {obj.key === 'Source' ? (
                          <SourceLink
                            source={variable[obj.key]}
                            link1={variable.Source_link}
                            link2={variable.Source_link_2}
                          />
                        ) : (
                          variable[obj.key]
                        )}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
            {viewType === 'desktop' ? <div id='opaque-el' /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

AboutTheData.propTypes = {
  config: PropTypes.object,
  project: PropTypes.string,
  viewType: PropTypes.string,
  setSelectedLink: PropTypes.func,
  infoIconConfig: PropTypes.object
};

export default AboutTheData;
