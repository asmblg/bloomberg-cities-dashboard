import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import SelectorMap from '../SelectorMap';
import TrendDataToggle from '../TrendDataToggle';
import IndicatorTrendBox from '../IndicatorTrendBox';
import SimpleIndicatorBox from '../SimpleIndicatorBox';
import CompareDropdownSelection from '../CompareDropdownSelection';
import MultiLineChart from '../MultiLineChart';
import CompareColumnChart from '../CompareColumnChart';
import SimpleColumnChart from '../SimpleColumnChart';
import SelectorWithLegend from '../SelectorWithLegend';
import IndicatorDropdown from '../IndicatorDropdown';
import ComboLineAreaChart from '../ComboLineAreaChart';
import UnderConstructionBox from '../UnderConstructionBox';
import AboutProject from '../AboutTheData';

import { handleElementStyle } from './utils';

const FlexLayoutElement = ({ data, setter, getter, layout, project, setSelectedLink, viewType }) => {
  const { columns, rows, content, height, width, style, mobileStyle } = layout;
  const elementRef = useRef();
  const type = columns ? 'columns' : rows ? 'rows' : content ? 'content' : '';
  const elementArray = columns || rows;

  return (
    <div key={elementRef} style={handleElementStyle(style, mobileStyle, height, width, viewType)} className={`flex-layout-${type}`}>
      {!content ? (
        elementArray.map((element, i) => (
          <FlexLayoutElement
            key={`recursive-flex-layout-el-${i}`}
            data={data}
            setter={setter}
            getter={getter}
            layout={element}
            project={project}
            setSelectedLink={setSelectedLink}
            viewType={viewType}
          />
        ))
      ) : content.type === 'selector-map' ? (
        <SelectorMap project={project} config={content.config} setter={setter} />
      ) : content.type === 'trend-data-toggler' ? (
        <TrendDataToggle config={content.config} getter={getter} setter={setter} />
      ) : content.type === 'title-with-trend-data-toggler' ? (
        <div className='detail-card-header'>
          {content?.config?.title ? (
            <h1 className='detail-card-title' style={content.config.titleStyle || {}}>
              {content.config?.title?.toUpperCase() || ''}
            </h1>
          ) : null}
          <TrendDataToggle
            config={content.config}
            getter={getter}
            setter={setter}
          />
        </div>
      ) : content.type === 'indicator-trend-box' ? (
        <IndicatorTrendBox
          data={data}
          config={content.config}
          getter={getter}
          setter={setter}
        />
      ) : content.type === 'simple-indicator-box' ? (
        <SimpleIndicatorBox
          data={data}
          config={content.config}
          getter={getter}
        />
      ) : content.type === 'compare-selector' ? (
        <CompareDropdownSelection
          data={data}
          config={content.config}
          getter={getter}
          setter={setter}
        />
      ) : content.type === 'multi-line-chart' ? (
        <MultiLineChart
          data={data || null}
          config={content.config}
          getter={getter}
          setter={setter}
        />
      ) : content.type === 'compare-column-chart' ? (
        <CompareColumnChart
          data={data || null}
          config={content.config}
          getter={getter}
          setter={setter}
        />
      ) : content.type === 'simple-column-chart' ? (
        <SimpleColumnChart
          config={content.config}
          data={data}
        />
      ) : content.type === 'selector-with-legend' ? (
        <SelectorWithLegend
          // options={content.options}
          // colors={content.colors}
          setter={setter}
          getter={getter}
          // setterKey={content.setterKey}
          config={content}
          data={data}
        />
      ) : content.type === 'indicator-dropdown' ? (
        <IndicatorDropdown
          setter={setter}
          getter={getter}
          config={content}
          options={!content.fixedIndicator ? content.indicators : null}
          selectedOption={content?.config?.fixedSelection || null}
        />
      ) : content.type === 'combo-line-area-chart' ? (
        <ComboLineAreaChart
          setter={setter}
          getter={getter}
          config={content}
          data={data}
        />
      ) : content.type === 'under-construction' ? (
        <UnderConstructionBox />
      ) : content.type === 'about-the-data' ? (
        <AboutProject
          config={content.config}
          project={project}
          setSelectedLink={setSelectedLink}                            
        />
      ) : (
        JSON.stringify(content)
      )}
    </div>
  );
};

FlexLayoutElement.propTypes = {
  data: PropTypes.object,
  setter: PropTypes.func,
  getter: PropTypes.object,
  layout: PropTypes.object,
  project: PropTypes.string,
  setSelectedLink: PropTypes.func,
  viewType: PropTypes.string
};

export default FlexLayoutElement;
