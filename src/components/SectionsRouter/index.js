import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Home from '../Home';
import DetailCard from '../DetailCard';
import AboutProject from '../AboutProject';

const SectionRouter = ({
  project,
  sections,
  sectionKeys,
  viewType,
  dashboardType,
  dataManifest,
  trendDataType,
  setTrendDataType
}) => (
  <Routes>
    {sectionKeys && sectionKeys[0]
      ? sectionKeys.map(key =>
        key === 'home' ? (
          <Route
            key={`home-route-${key}`}
            path={`/${project.toLowerCase()}/${dashboardType}`}
            element={
              <Home
                config={sections[key]}
                dataManifest={dataManifest}
                project={project}
                viewType={viewType}
                trendDataType={trendDataType}
                setTrendDataType={setTrendDataType}
              />
            }
          />
        ) : (
          <Route
            key={`detail-route-${key}`}
            path={`/${project.toLowerCase()}/${dashboardType}/${key}`}
            element={
              <DetailCard
                config={sections[key]}
                sectionKey={key}
                project={project}
                viewType={viewType}
                dataManifest={dataManifest}
                trendDataType={trendDataType}
                setTrendDataType={setTrendDataType}
              />
            }
          />
        )
      )
      : null}
    <Route
      key={'about-route'}
      path={`/${project.toLowerCase()}/${dashboardType}/about`}
      element={<AboutProject viewType={viewType} />}
    />
    <Route
      key={'docs-route'}
      path={`/${project.toLowerCase()}/${dashboardType}/docs`}
      element={<Home config={sections['home']} project={project} viewType={viewType} docs={true} />}
    />
  </Routes>
);

SectionRouter.propTypes = {
  project: PropTypes.string,
  dashboardType: PropTypes.string,
  sectionKeys: PropTypes.array,
  sections: PropTypes.object,
  viewType: PropTypes.string,
  dataManifest: PropTypes.object,
  trendDataType: PropTypes.string,
  setTrendDataType: PropTypes.func
};

export default SectionRouter;
