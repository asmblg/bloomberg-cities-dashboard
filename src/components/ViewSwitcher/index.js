import React from 'react';
import PropTypes from 'prop-types';

import SectionTitle from '../SectionTitle';

import { handleViewSwitch } from './utils';
import './style.css';

const ViewSwitcher = ({
  setView,
  viewObject,
  viewOptions,
  tabStyle,
  selectedLink,
  setSelectedLink,
  setInfoIconConfig,
  project,
  viewType
}) => (
  <div
    className='view-switcher-container'
    style={
      viewType !== 'mobile'
        ? { flexDirection: 'row', alignItems: 'center' }
        : { flexDirection: 'column', alignItems: 'flex-start' }
    }
  >
    <SectionTitle
      config={{
        title: viewObject.title || '',
        tabStyle
      }}
      setInfoIconConfig={setInfoIconConfig}
      selectedLink={selectedLink}
      setSelectedLink={setSelectedLink}
      project={project}
    />
    {viewObject?.link?.key && viewObject.link.text && (
      <h5
        className='view-switcher-link'
        style={{ padding: viewType !== 'mobile' ? '20px' : '10px 20px 0 20px' }}
        onClick={() =>
          handleViewSwitch({
            viewKey: viewObject.link.key,
            setter: setView,
            viewOptions
          })
        }
        role='button'
      >
        {viewObject.link.text}
      </h5>
    )}
  </div>
);

ViewSwitcher.propTypes = {
  project: PropTypes.string,
  setView: PropTypes.func,
  viewObject: PropTypes.object,
  viewOptions: PropTypes.array,
  tabStyle: PropTypes.object,
  selectedLink: PropTypes.string,
  setSelectedLink: PropTypes.func,
  setInfoIconConfig: PropTypes.func,
  viewType: PropTypes.string
};

export default ViewSwitcher;
