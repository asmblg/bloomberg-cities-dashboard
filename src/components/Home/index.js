import React from 'react';
import PropTypes from 'prop-types';

import OverviewCard from '../OverviewCard';
import SummaryCard from '../SummaryCard';

const Home = ({ config }) => {
  console.log(config);
  return (
    <div>
      <SummaryCard />
      <OverviewCard />
    </div>
  );
};

Home.propTypes = {
  config: PropTypes.object
};

export default Home;
