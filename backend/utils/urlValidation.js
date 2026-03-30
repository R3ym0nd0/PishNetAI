function normalizeAndValidateUrl(rawUrl) {
  const input = String(rawUrl || '').trim();

  if (!input) {
    return { ok: false, error: 'Please enter a website URL.' };
  }

  let parsed;

  try {
    parsed = new URL(input);
  } catch (error) {
    return { ok: false, error: 'Please enter a valid HTTP or HTTPS URL.' };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { ok: false, error: 'Only HTTP and HTTPS URLs are supported.' };
  }

  return { ok: true, url: parsed.toString(), parsed };
}

module.exports = {
  normalizeAndValidateUrl
};
