import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Legend, Cell } from 'recharts';

// const renderLabel = ({ name, color }) => {
//   return <text color={color}>{name}</text>;
// };

const DonutChart = ({ dataArray }) => (
  <ResponsiveContainer width={'100%'} height={300}>
    <PieChart>
      <Pie
        data={dataArray}
        dataKey='value'
        cx='50%'
        cy='50%'
        innerRadius={'50%'}
        // label={renderLabel}
        labelLine={false}
      >
        {dataArray.map(({ color }, i) => (
          <Cell key={`cell-${i}`} fill={color} />
        ))}
      </Pie>
      <Legend width='45%' layout='vertical' verticalAlign='middle' align='left' />
    </PieChart>
  </ResponsiveContainer>
);

// layout='vertical' verticalAlign='middle' align='left'
// width={viewType === 'desktop' ? '45%' : '100%'}
// layout={viewType === 'desktop' ? 'vertical' : 'horizontal'}
// verticalAlign={viewType === 'desktop' ? 'middle' : 'bottom'}
// align={viewType === 'desktop' ? 'left' : 'center'}

DonutChart.propTypes = {
  dataArray: PropTypes.array,
  viewType: PropTypes.string
};

export default DonutChart;
