const fs = require('fs');
const path = require('path');

const PHISHING_DATASET_PATH = path.resolve(__dirname, '..', '..', 'verified_online.csv');

let phishingDatasetCache = null;

function normalizePathname(pathname) {
  const value = String(pathname || '/').trim();
  if (!value || value === '/') return '/';
  return value.endsWith('/') && value.length > 1 ? value.slice(0, -1) : value;
}

function normalizeUrlVariants(rawUrl) {
  try {
    const parsed = new URL(String(rawUrl || '').trim());
    parsed.hash = '';

    const hostname = parsed.hostname.toLowerCase();
    const pathname = normalizePathname(parsed.pathname);
    const search = parsed.search || '';
    const fullKey = `${hostname}${pathname}${search}`;
    const pathKey = `${hostname}${pathname}`;

    return {
      hostname,
      pathname,
      fullKey,
      pathKey
    };
  } catch (error) {
    return null;
  }
}

function loadLocalPhishingDataset() {
  if (phishingDatasetCache) return phishingDatasetCache;

  const fullUrlKeys = new Map();
  const hostPathKeys = new Map();

  try {
    if (fs.existsSync(PHISHING_DATASET_PATH)) {
      const contents = fs.readFileSync(PHISHING_DATASET_PATH, 'utf8');
      const lines = contents.split(/\r?\n/).slice(1);

      lines.forEach((line) => {
        const trimmed = String(line || '').trim();
        if (!trimmed) return;

        const parts = trimmed.split(',');
        const url = String(parts[1] || '').trim();
        const verified = String(parts[4] || '').trim().toLowerCase();
        const online = String(parts[6] || '').trim().toLowerCase();
        const target = String(parts[7] || '').trim();
        const variants = normalizeUrlVariants(url);

        if (!variants || verified !== 'yes' || online !== 'yes') return;

        fullUrlKeys.set(variants.fullKey, {
          target: target || 'Other',
          source: 'verified_online.csv',
          matchType: 'exact-url'
        });

        if (!hostPathKeys.has(variants.pathKey)) {
          hostPathKeys.set(variants.pathKey, {
            target: target || 'Other',
            source: 'verified_online.csv',
            matchType: 'host-path'
          });
        }
      });
    }
  } catch (error) {
    // Ignore dataset loading failures and fall back to empty sets.
  }

  phishingDatasetCache = {
    fullUrlKeys,
    hostPathKeys
  };

  return phishingDatasetCache;
}

function lookupLocalPhishingDataset(rawUrl) {
  const variants = normalizeUrlVariants(rawUrl);

  if (!variants) {
    return {
      checked: false,
      flagged: false,
      source: 'verified_online.csv',
      matchType: null,
      target: null
    };
  }

  const dataset = loadLocalPhishingDataset();
  const exactMatch = dataset.fullUrlKeys.get(variants.fullKey);
  if (exactMatch) {
    return {
      checked: true,
      flagged: true,
      source: exactMatch.source,
      matchType: exactMatch.matchType,
      target: exactMatch.target
    };
  }

  const hostPathMatch = dataset.hostPathKeys.get(variants.pathKey);
  if (hostPathMatch) {
    return {
      checked: true,
      flagged: true,
      source: hostPathMatch.source,
      matchType: hostPathMatch.matchType,
      target: hostPathMatch.target
    };
  }

  return {
    checked: true,
    flagged: false,
    source: 'verified_online.csv',
    matchType: null,
    target: null
  };
}

module.exports = {
  lookupLocalPhishingDataset
};
