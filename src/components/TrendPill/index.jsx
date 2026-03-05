import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import formatValue from '../../utils/formatValue';
import dateToQuarter from '../../utils/dateToQuarter';
import calculateTrend from '../../utils/calculateTrend';
import upwardTrendIcon from './images/upward_trend_icon.png';
import downwardTrendIcon from './images/downward_trend_icon.png';
import './style.css';

const TrendPill = ({
  lng,
  height,
  width,
  currentValue,
  compareValue,
  compareDate,
  units,
  positiveTrendDirection,
  displayCompareText,
  compareValueUnderPill,
  onlyYears,
  trendDataType
}) => {
  const { trendValue, trendDirection } = calculateTrend(currentValue, compareValue, units);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const lang = query.get('lng') || null;
  const heightVal = height ? (typeof height === 'number' ? `${height}px` : height) : null;
  const widthVal = width ? (typeof width === 'number' ? `${width}px` : width) : null;
  const trendValueNotNumber = trendValue?.match(/NaN|undefined|infinity/i);

  console.log({trendValue, currentValue, compareValue, compareDate})
  return (
    <div
      className='trend-display-wrapper'
      style={{ 
        flexDirection: compareValueUnderPill ? 'column' : 'row',
        alignItems: compareValueUnderPill ? 'flex-start' : 'center' 
      }}
    >
      {currentValue && (compareValue || compareValue === 0) && compareDate && !trendValueNotNumber ? (
        <>
          <div
            className={ (positiveTrendDirection === 'neutral')
              ? 'neutral-trend'
              : (positiveTrendDirection === 'down' && trendDirection === 'down') ||
                (positiveTrendDirection === 'up' && trendDirection === 'up')
                  ? 'upward-trend'
                  : 'downward-trend'
            }
            style={{ height: heightVal || '', width: widthVal || '' }}
          >
            <img src={trendDirection === 'up' ? upwardTrendIcon : downwardTrendIcon} />
            <h5>{trendValue}</h5>
          </div>
          {displayCompareText ? (
            <h5 className='trend-pill-text' style={{ opacity: '0.8' }}>{`vs ${formatValue(
              compareValue,
              units
            )} ${lang === 'pt' ? 'em' : 'in'} ${onlyYears ? compareDate : dateToQuarter(compareDate, 'QX YYYY', lng)}`}</h5>
          ) : null}
        </>
      ) : (
        <>
          <div
            className={'no-data-pill'
            }
            style={{ height: heightVal || '', width: widthVal || '' }}
          >
              { 
                trendValueNotNumber 
                ? lang === 'pt'
                  ? 'Dados insuficientes para calcular tendência' 
                  : 'Insufficient Data To Calculate Trend'
                : onlyYears && trendDataType === 'YtY'
                ? lang === 'pt'
                  ? 'Dados comparativos não disponíveis por trimestre' 
                  : 'Comparison Data Unavailable By Quarter'
                : lang === 'pt'
                  ? 'Dados comparativos atualmente indisponíveis' 
                  : 'Comparison Data Unavailable'
              }
          </div>
        </>
      )}
    </div>
  );
};

TrendPill.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  compareDate: PropTypes.string,
  compareValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  units: PropTypes.string,
  positiveTrendDirection: PropTypes.string,
  displayCompareText: PropTypes.bool,
  compareValueUnderPill: PropTypes.bool
};

export default TrendPill;
