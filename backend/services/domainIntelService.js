const fs = require('fs');
const path = require('path');
const axios = require('axios');

const RDAP_BASE_URL = process.env.RDAP_BASE_URL || 'https://rdap.org/domain/';
const domainIntelCache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60 * 12;
const LEGITIMATE_DATASET_PATH = path.resolve(__dirname, '..', '..', 'top-1m.csv');
let legitimateDomainsCache = null;

function getBaseDomain(hostname) {
  const value = String(hostname || '').toLowerCase().trim();
  const parts = value.split('.').filter(Boolean);
  if (parts.length <= 2) return value;
  return parts.slice(-2).join('.');
}

function loadLegitimateDomains() {
  if (legitimateDomainsCache) return legitimateDomainsCache;

  const domains = new Set();

  try {
    if (fs.existsSync(LEGITIMATE_DATASET_PATH)) {
      const contents = fs.readFileSync(LEGITIMATE_DATASET_PATH, 'utf8');
      contents.split(/\r?\n/).forEach((line) => {
        const trimmed = String(line || '').trim();
        if (!trimmed) return;

        const [, domain] = trimmed.split(',', 2);
        const normalized = String(domain || '').toLowerCase().trim();
        if (!normalized) return;

        domains.add(normalized);
        domains.add(getBaseDomain(normalized));
      });
    }
  } catch (error) {
    // Ignore dataset loading failures and fall back to an empty trust list.
  }

  legitimateDomainsCache = domains;
  return legitimateDomainsCache;
}

function isKnownLegitimateDomain(hostname) {
  const normalized = String(hostname || '').toLowerCase().trim();
  if (!normalized) return false;

  const legitimateDomains = loadLegitimateDomains();
  return legitimateDomains.has(normalized) || legitimateDomains.has(getBaseDomain(normalized));
}

function getCached(hostname) {
  const cached = domainIntelCache.get(hostname);
  if (!cached) return null;

  if ((Date.now() - cached.cachedAt) > CACHE_TTL_MS) {
    domainIntelCache.delete(hostname);
    return null;
  }

  return cached.value;
}

function setCached(hostname, value) {
  domainIntelCache.set(hostname, {
    value,
    cachedAt: Date.now()
  });
}

function parseRdapDate(events = []) {
  const priorityActions = [
    'registration',
    'registered',
    'creation',
    'created'
  ];

  for (const action of priorityActions) {
    const match = events.find((event) => String(event.eventAction || '').toLowerCase() === action);
    if (match?.eventDate) {
      return match.eventDate;
    }
  }

  const fallback = events.find((event) => event?.eventDate);
  return fallback?.eventDate || null;
}

function formatDomainAge(ageDays) {
  if (typeof ageDays !== 'number' || Number.isNaN(ageDays) || ageDays < 0) {
    return 'Unavailable';
  }

  if (ageDays < 30) {
    return `${ageDays} day${ageDays === 1 ? '' : 's'}`;
  }

  const months = Math.floor(ageDays / 30);
  if (months < 12) {
    return `${months} month${months === 1 ? '' : 's'}`;
  }

  const years = Math.floor(ageDays / 365);
  const remainingMonths = Math.floor((ageDays % 365) / 30);

  if (remainingMonths === 0) {
    return `${years} year${years === 1 ? '' : 's'}`;
  }

  return `${years} year${years === 1 ? '' : 's'} ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`;
}

async function lookupDomainIntel(hostname) {
  if (!hostname) {
    return {
      domainAge: 'Unavailable',
      domainAgeDays: null,
      createdAt: null,
      registrar: null
    };
  }

  const cached = getCached(hostname);
  if (cached) return cached;

  try {
    const response = await axios.get(`${RDAP_BASE_URL}${encodeURIComponent(hostname)}`, {
      timeout: 4500,
      headers: {
        'Accept': 'application/rdap+json, application/json'
      }
    });

    const payload = response.data || {};
    const createdAtRaw = parseRdapDate(payload.events || []);
    const createdAt = createdAtRaw ? new Date(createdAtRaw) : null;
    const domainAgeDays = createdAt && !Number.isNaN(createdAt.getTime())
      ? Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : null;
    const registrar = Array.isArray(payload.entities)
      ? (payload.entities.find((entity) => Array.isArray(entity.roles) && entity.roles.includes('registrar'))?.handle || null)
      : null;

    const result = {
      domainAge: formatDomainAge(domainAgeDays),
      domainAgeDays,
      createdAt: createdAt ? createdAt.toISOString() : null,
      registrar
    };

    setCached(hostname, result);
    return result;
  } catch (error) {
    const fallback = {
      domainAge: 'Unavailable',
      domainAgeDays: null,
      createdAt: null,
      registrar: null
    };

    setCached(hostname, fallback);
    return fallback;
  }
}

module.exports = {
  lookupDomainIntel,
  isKnownLegitimateDomain
};
