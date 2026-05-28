require('dotenv').config();

const normalize = (value = '') => `${value}`.trim().toLowerCase();
const normalizeSectionToken = (value = '') => normalize(value).replace(/\s+/g, '-');

const SECTION_VARIABLE_TAB_MATCHERS = {
  jobs: tab => normalize(tab).includes('jobs and employment'),
  workers: tab => normalize(tab).includes('workforce and education'),
  business: tab => normalize(tab) === 'business',
  realestate: tab => normalize(tab).startsWith('real estate'),
  innovation: tab => normalize(tab).includes('innovation'),
  tourism: tab => normalize(tab).includes('tourism'),
  'city-overview': tab => normalize(tab).includes('city overview'),
  office: tab => normalize(tab).includes('real estate - office'),
  industrial: tab => normalize(tab).includes('real estate - industrial'),
  retail: tab => normalize(tab).includes('real estate - retail'),
  residential: tab => normalize(tab).includes('real estate - residential')
};

const collectReferencedManifestKeys = (node, keySet) => {
  if (!node) return;

  if (Array.isArray(node)) {
    node.forEach(item => collectReferencedManifestKeys(item, keySet));
    return;
  }

  if (typeof node !== 'object') {
    return;
  }

  if (typeof node.manifestKey === 'string' && node.manifestKey) {
    keySet.add(node.manifestKey);
  }

  if (
    typeof node.selectedIndicatorManifestKey === 'string'
    && node.selectedIndicatorManifestKey
  ) {
    keySet.add(node.selectedIndicatorManifestKey);
  }

  Object.values(node).forEach(value => collectReferencedManifestKeys(value, keySet));
};

const resolveSectionKey = (sections = {}, sectionQuery) => {
  if (!sectionQuery) return null;

  const normalizedQuery = normalizeSectionToken(sectionQuery);
  const sectionEntries = Object.keys(sections || {});

  const directMatch = sectionEntries.find(key => normalizeSectionToken(key) === normalizedQuery);
  if (directMatch) return directMatch;

  const aliasMap = {
    'key-indicators': 'key-indicators',
    'key-indicator': 'key-indicators',
    'city-overview': 'city-overview',
    cityoverview: 'city-overview'
  };

  return aliasMap[normalizedQuery] || null;
};

const variableHasSectionKey = (variable, sectionQuery, sectionKey) => {
  const queryToken = normalizeSectionToken(sectionQuery);
  const sectionToken = normalizeSectionToken(sectionKey || '');
  const variableSectionKey = variable?.sectionKey;

  if (!variableSectionKey) return false;

  const variableTokens = (Array.isArray(variableSectionKey) ? variableSectionKey : [variableSectionKey])
    .map(item => normalizeSectionToken(item));

  return variableTokens.includes(queryToken)
    || (sectionToken && variableTokens.includes(sectionToken));
};

const compileSectionManifest = (sections = {}, sectionQuery, fallbackManifest = {}) => {
  const sectionKey = resolveSectionKey(sections, sectionQuery);

  if (sectionQuery) {
    if (sectionKey && sections?.[sectionKey]?.manifest) {
      return {
        manifest: { ...sections[sectionKey].manifest },
        sectionKey
      };
    }

    // Backward compatible fallback for datasets that only have top-level manifest.
    const referencedManifestKeys = new Set();
    if (sectionKey && sections?.[sectionKey]) {
      collectReferencedManifestKeys(sections[sectionKey], referencedManifestKeys);
    }

    const scopedFallback = {};
    referencedManifestKeys.forEach((key) => {
      if (fallbackManifest?.[key]) {
        scopedFallback[key] = fallbackManifest[key];
      }
    });

    return {
      manifest: scopedFallback,
      sectionKey
    };
  }

  const manifest = {};
  Object.values(sections || {}).forEach((sectionObj) => {
    Object.assign(manifest, sectionObj?.manifest || {});
  });

  if (Object.keys(manifest).length === 0 && fallbackManifest && typeof fallbackManifest === 'object') {
    Object.assign(manifest, fallbackManifest);
  }

  return {
    manifest,
    sectionKey: null
  };
};

const filterVariablesBySection = (variables = [], sectionQuery, sectionKey) => {
  if (!sectionQuery) return variables;

  const variablesWithSectionKey = variables.filter(variable => variable?.sectionKey);
  if (variablesWithSectionKey.length) {
    return variables.filter(variable => variableHasSectionKey(variable, sectionQuery, sectionKey));
  }

  const normalizedQuery = normalize(sectionQuery);
  const matcher = SECTION_VARIABLE_TAB_MATCHERS[sectionKey] || SECTION_VARIABLE_TAB_MATCHERS[normalizedQuery];

  if (matcher) {
    return variables.filter(variable => matcher(variable?.Tab));
  }

  return variables.filter((variable) => {
    const tab = normalize(variable?.Tab);
    return tab.includes(normalizedQuery);
  });
};

const buildAboutPayload = (configObj, sectionQuery) => {
  const normalizedConfig = typeof configObj?.toObject === 'function' ? configObj.toObject() : configObj;
  const variables = normalizedConfig?.variables || [];
  const sections = normalizedConfig?.sections || {};
  const fallbackManifest = normalizedConfig?.manifest || {};
  const { manifest, sectionKey } = compileSectionManifest(sections, sectionQuery, fallbackManifest);

  return {
    variables: filterVariablesBySection(variables, sectionQuery, sectionKey),
    manifest
  };
};

module.exports = {
  getVariables: (req, res) => {
    const { project, lng, section } = req.query;
    const localConfigPath = process.env.LOCAL_CONFIG_PATH;
    if (localConfigPath) {
      const localConfig = require(localConfigPath);
      const obj = localConfig.find(
        ({ project: p, lng: l }) => 
          p.toLowerCase() === project.toLowerCase() && 
        (!lng ? !l : l === lng)
      );
      res.json(obj ? buildAboutPayload(obj, section) : { variables: [], manifest: {} });
    } else {
      const { getModelsForRequest } = require('../models');
      if (!project) {
        return res.status(400).json({
          error: 'Please provide a project'
        });
      } else {
        let config;
        try {
          ({ config } = getModelsForRequest(req));
        } catch (err) {
          return res.status(503).json({ message: err.message });
        }
        const regexProject = new RegExp(project, 'i');
        config
          .findOne({ project: regexProject, lng: lng ? lng : { $exists: false } })
          .then(dbModel => {
            res.json(dbModel ? buildAboutPayload(dbModel, section) : { variables: [], manifest: {} });
          })
          .catch(err => res.status(422).json(err));
      }
    }
  }
};
