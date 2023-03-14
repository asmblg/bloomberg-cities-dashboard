import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Home from '../Home';
import DetailCard from '../DetailCard';
import AboutProject from '../AboutProject';

const SectionRouter = ({ project, sections, sectionKeys, viewType }) => (
  <Routes>
    {sectionKeys && sectionKeys[0]
      ? sectionKeys.map(key =>
        key === 'home' ? (
          <Route
            key={`home-route-${key}`}
            path={`/${project.toLowerCase()}`}
            element={<Home config={sections[key]} project={project} viewType={viewType} />}
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
              />
            }
          />
        )
      )
      : null}
    <Route
      key={'about-route'}
      path={`/${project.toLowerCase()}/about`}
      element={<AboutProject viewType={viewType} />}
    />
    <Route
      key={'docs-route'}
      path={`/${project.toLowerCase()}/docs`}
      element={<Home config={sections['home']} project={project} viewType={viewType} docs={true} />}
    />
  </Routes>
);

SectionRouter.propTypes = {
  project: PropTypes.string,
  sectionKeys: PropTypes.array,
  sections: PropTypes.object,
  viewType: PropTypes.string
};

export default SectionRouter;
