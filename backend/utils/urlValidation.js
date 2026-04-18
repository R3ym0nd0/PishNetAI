const IPV4_HOST_REGEX = /^(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:[/?#].*)?$/;
const HOSTNAME_INPUT_REGEX = /^(?:localhost(?::\d+)?|[^\s/]+\.[^\s/]+)(?:[/?#].*)?$/i;
const SCHEME_REGEX = /^[a-z][a-z\d+.-]*:/i;

function normalizePossibleUrl(input) {
  if (SCHEME_REGEX.test(input)) {
    return input;
  }

  if (HOSTNAME_INPUT_REGEX.test(input) || IPV4_HOST_REGEX.test(input)) {
    return `https://${input}`;
  }

  return input;
}

function normalizeAndValidateUrl(rawUrl) {
  const input = String(rawUrl || '').trim();

  if (!input) {
    return { ok: false, error: 'Please enter a website URL.' };
  }

  let parsed;

  try {
    parsed = new URL(normalizePossibleUrl(input));
  } catch (error) {
    return { ok: false, error: 'Please enter a valid HTTP or HTTPS URL.' };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { ok: false, error: 'Only HTTP and HTTPS URLs are supported.' };
  }

  if (!parsed.hostname) {
    return { ok: false, error: 'Please enter a complete website URL.' };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, error: 'URLs with embedded usernames or passwords are not supported.' };
  }

  return { ok: true, url: parsed.toString(), parsed };
}

module.exports = {
  normalizeAndValidateUrl
};
