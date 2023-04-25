import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import './style.css';

const AboutTheData = ({ config, project, setSelectedLink }) => {
  const navigate = useNavigate();

  const handleScroll = () => {
    const container = document.querySelector('.about-table-vars-container');
    const opaqueElement = document.querySelector('#opaque-el');
    const pxTolerance = 1;
    const isAtBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight - pxTolerance;

    if (!isAtBottom) {
      opaqueElement.style.bottom = `${-container.scrollTop}px`;
    } else {
      opaqueElement.style.bottom = '0';
    }
  };

  return (
    <div className='about-data-container'>
      <div className='detail-card-header'>
        {config?.title ? (
          <h1 className='detail-card-title' style={config.titleStyle || {}}>
            {config.title.toUpperCase() || ''}
          </h1>
        ) : null}
        <div
          className='about-back-link'
          onClick={() => {
            setSelectedLink('home');
            navigate(`/${project}`);
          }}
        >
          <h5>{'BACK TO DASHBOARD'}</h5>
          <Icon size='large' name='close' />
        </div>
      </div>
      {config?.variableTable?.headerRow?.[0] && config.variableTable.variables?.[0] ? (
        <div className='about-table-container'>
          <div className='about-table-header-container'>
            {config.variableTable.headerRow.map((row, i) => (
              <div role='table' key={`table-header-${row.key}-${i}`}>
                {row.text}
              </div>
            ))}
          </div>
          <div role='table' className='about-table-vars-container' onScroll={() => handleScroll()}>
            <table className='about-table'>
              {config.variableTable.variables.map((variable, i) => (
                <tr key={`variable-row-${i}`} className='about-table-row'>
                  {config.variableTable.headerRow.map((obj, ii) => (
                    <td
                      key={`variable-${i}-data-${ii}`}
                      style={obj.key === 'variable' ? { fontWeight: 'bold' } : {}}
                    >
                      {obj.key === 'source' && variable.source_link ? (
                        <a href={variable.source_link} target='_blank' rel='noreferrer'>
                          {variable[obj.key]}
                        </a>
                      ) : (
                        variable[obj.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </table>
            <div id='opaque-el' />
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
  setSelectedLink: PropTypes.func
};

export default AboutTheData;
