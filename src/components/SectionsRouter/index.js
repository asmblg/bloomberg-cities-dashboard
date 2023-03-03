import React, { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import OverviewCard from '../OverviewCard';
import SummaryCard from '../SummaryCard';
import DetailCard from '../DetailCard';

const SectionRouter = ({ project, sections, sectionKeys }) => (
  <Routes>
    {sectionKeys && sectionKeys[0]
      ? sectionKeys.map(key =>
        key === 'overview' ? (
          <Route
            key={`main-route-${key}`}
            path={`/${project.toLowerCase()}`}
            element={<OverviewCard config={sections[key]} />}
          />
        ) : (
          <Fragment key={`summary-detail-routes-${key}`}>
            <Route
              path={`/${project.toLowerCase()}/${key}`}
              element={<SummaryCard config={sections[key]} project={project} sectionKey={key} />}
            />
            <Route
              path={`/${project.toLowerCase()}/${key}/detail`}
              element={<DetailCard config={sections[key]} project={project} sectionKey={key} />}
            />
          </Fragment>
        )
      )
      : null}
  </Routes>
);

SectionRouter.propTypes = {
  project: PropTypes.string,
  sectionKeys: PropTypes.array,
  sections: PropTypes.object
};

export default SectionRouter;
