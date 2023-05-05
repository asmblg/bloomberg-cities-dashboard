import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Home from '../Home';
import DetailCard from '../DetailCard';

const SectionRouter = ({
  project,
  sections,
  sectionKeys,
  viewType,
  // dashboardType,
  trendDataType,
  setTrendDataType,
  setSelectedLink
}) => (
  <Routes>
    { sectionKeys?.[0]
      ? sectionKeys.map(key =>
        key === 'home' ? (
          <Route
            key={`home-route-${key}`}
            path={`/${project.toLowerCase()}`}
            element={
              <Home
                config={sections[key]}
                project={project}
                // dashboardType={dashboardType}
                viewType={viewType}
                trendDataType={trendDataType}
                setTrendDataType={setTrendDataType}
                setSelectedLink={setSelectedLink}
              />
            }
          />
        ) : (
          <Route
            key={`detail-route-${key}`}
            path={`/${project.toLowerCase()}/${key}`}
            element={
              <DetailCard
                config={sections[key]}
                sectionKey={key}
                project={project}
                viewType={viewType}
                trendDataType={trendDataType}
                setTrendDataType={setTrendDataType}
                setSelectedLink={setSelectedLink}
              />
            }
          />
        )
      )
      : null}
  </Routes>
);

SectionRouter.propTypes = {
  project: PropTypes.string,
  dashboardType: PropTypes.string,
  sectionKeys: PropTypes.array,
  sections: PropTypes.object,
  viewType: PropTypes.string,
  trendDataType: PropTypes.string,
  setTrendDataType: PropTypes.func,
  setSelectedLink: PropTypes.func
};

export default SectionRouter;
