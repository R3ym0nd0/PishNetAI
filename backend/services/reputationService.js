const axios = require('axios');

const SAFE_BROWSING_API_KEY = String(process.env.SAFE_BROWSING_API_KEY || '').trim();
const SAFE_BROWSING_API_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';
const SAFE_BROWSING_TIMEOUT_MS = Number(process.env.SAFE_BROWSING_TIMEOUT_MS || 8000);

async function lookupUrlReputation(url) {
  const normalizedUrl = String(url || '').trim();

  if (!normalizedUrl || !SAFE_BROWSING_API_KEY) {
    return {
      enabled: Boolean(SAFE_BROWSING_API_KEY),
      checked: false,
      flagged: false,
      provider: 'google-safe-browsing',
      threatTypes: [],
      platformTypes: [],
      error: null
    };
  }

  try {
    const response = await axios.post(
      `${SAFE_BROWSING_API_URL}?key=${encodeURIComponent(SAFE_BROWSING_API_KEY)}`,
      {
        client: {
          clientId: 'phishnet-ai',
          clientVersion: '1.0.0'
        },
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION'
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url: normalizedUrl }]
        }
      },
      {
        timeout: SAFE_BROWSING_TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const matches = Array.isArray(response.data?.matches) ? response.data.matches : [];

    return {
      enabled: true,
      checked: true,
      flagged: matches.length > 0,
      provider: 'google-safe-browsing',
      threatTypes: [...new Set(matches.map((match) => match.threatType).filter(Boolean))],
      platformTypes: [...new Set(matches.map((match) => match.platformType).filter(Boolean))],
      error: null
    };
  } catch (error) {
    return {
      enabled: true,
      checked: false,
      flagged: false,
      provider: 'google-safe-browsing',
      threatTypes: [],
      platformTypes: [],
      error: error.response?.data?.error?.message || error.message || 'Reputation lookup failed.'
    };
  }
}

module.exports = {
  lookupUrlReputation
};
