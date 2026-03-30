const axios = require('axios');

const RDAP_BASE_URL = process.env.RDAP_BASE_URL || 'https://rdap.org/domain/';
const domainIntelCache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60 * 12;

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
  lookupDomainIntel
};
