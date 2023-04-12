import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import SelectorMap from '../SelectorMap';
import TrendDataToggle from '../TrendDataToggle';
import IndicatorTrendBox from '../IndicatorTrendBox';
import CompareDropdownSelection from '../CompareDropdownSelection';
import MultiLineChart from '../MultiLineChart';
import CompareColumnChart from '../CompareColumnChart';

const FlexLayoutElement = ({ data, setter, getter, layout, project }) => {
  const { columns, rows, content, height, width, style } = layout;
  const elementRef = useRef();
  const type = columns ? 'columns' : rows ? 'rows' : content ? 'content' : '';
  const elementArray = columns || rows;

  const elementStyle = {
    ...style,
    height,
    width
  };

  return (
    <div key={elementRef} style={elementStyle || {}} className={`flex-layout-${type}`}>
      {!content ? (
        elementArray.map((element, i) => (
          <FlexLayoutElement
            key={`recursive-flex-layout-el-${i}`}
            data={data}
            setter={setter}
            getter={getter}
            layout={element}
            project={project}
          />
        ))
      ) : content.type === 'selector-map' ? (
        <SelectorMap project={project} config={content.config} setter={setter} />
      ) : content.type === 'trend-data-toggler' ? (
        <TrendDataToggle config={content.config} getter={getter} setter={setter} />
      ) : content.type === 'indicator-trend-box' ? (
        <IndicatorTrendBox
          data={data?.[project]}
          config={content.config}
          getter={getter}
          setter={setter}
        />
      ) : content.type === 'city-compare-selector' ? (
        <CompareDropdownSelection config={content.config} getter={getter} setter={setter} />
      ) : content.type === 'multi-line-chart' ? (
        <MultiLineChart
          data={data || null}
          config={content.config}
          getter={getter}
        />
      ) : content.type === 'compare-column-chart' ? (
        <CompareColumnChart
          data={data || null}
          config={content.config}
          getter={getter}
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
  project: PropTypes.string
};

export default FlexLayoutElement;
