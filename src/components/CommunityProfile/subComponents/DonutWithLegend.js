import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Legend, Cell } from 'recharts';

import { handleDonutDataArray } from '../utils';

const DonutWithLegend = ({ indicators, data, colors }) => {
  const [dataArray, setDataArray] = useState(null);

  useEffect(() => {
    if (indicators && data) {
      setDataArray(handleDonutDataArray(indicators, data, colors));
    }
  }, [indicators, data, colors]);
  return dataArray && dataArray[0] ? (
    <ResponsiveContainer width={'100%'} height={300}>
      <PieChart>
        <Pie
          data={dataArray}
          dataKey='value'
          cx='40%'
          cy='50%'
          innerRadius={'35%'}
          outerRadius={'60%'}
          labelLine={false}
          label={renderCustomLabels}
          startAngle={-270}
          endAngle={90}
        >
          {dataArray.map(({ color }, i) => (
            <Cell key={`cell-${i}`} fill={color} />
          ))}
        </Pie>
        <Legend
          width='45%'
          layout='vertical'
          verticalAlign='middle'
          align='left'
          content={renderCustomLegend}
        />
      </PieChart>
    </ResponsiveContainer>
  ) : null;
};

DonutWithLegend.propTypes = {
  indicators: PropTypes.array,
  data: PropTypes.object,
  colors: PropTypes.array,
  viewType: PropTypes.string
};

function renderCustomLegend({ payload }) {
  const legendPayloadArr = payload.filter(({ value }) => value); // Indicators without a label (value) will be left blank

  return legendPayloadArr && legendPayloadArr[0]
    ? legendPayloadArr.map(({ value, color }, i) => (
      <div className='cp-donut-legend' key={`legend-item-${value}-${color}-${i}`}>
        <svg height={'10px'} width={'10px'} style={{ marginRight: '10px' }}>
          <rect fill={color} height={'10px'} width={'10px'} />
        </svg>
        <h5>{value}</h5>
      </div>
    ))
    : null;
}

function renderCustomLabels({ innerRadius, outerRadius, midAngle, cx, cy, percent, fill }) {
  const RADIAN = Math.PI / 180;
  const radius = 10 + innerRadius + (outerRadius - innerRadius);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill={fill} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
      {`${Number(percent * 100).toFixed(1)}%`}
    </text>
  );
}

export default DonutWithLegend;
