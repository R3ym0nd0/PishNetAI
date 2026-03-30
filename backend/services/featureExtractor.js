const dns = require('dns').promises;
const cheerio = require('cheerio');
const { MODEL_FEATURE_ORDER } = require('../constants/featureOrder');
const { lookupDomainIntel } = require('./domainIntelService');

const SUSPICIOUS_KEYWORDS = [
  'login',
  'verify',
  'account',
  'secure',
  'update',
  'password',
  'urgent',
  'confirm',
  'signin'
];
const IPV4_HOST_REGEX = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const SHORTENER_DOMAINS = new Set([
  'bit.ly',
  'tinyurl.com',
  'goo.gl',
  't.co',
  'is.gd',
  'ow.ly',
  'buff.ly',
  'rebrand.ly',
  'cutt.ly',
  'shorturl.at'
]);
const SUSPICIOUS_TLDS = new Set([
  'xyz',
  'top',
  'click',
  'gq',
  'tk',
  'ml',
  'work',
  'support',
  'country'
]);
const SUSPICIOUS_PATH_KEYWORDS = [
  'login',
  'signin',
  'verify',
  'account',
  'secure',
  'update',
  'auth',
  'wallet',
  'billing',
  'confirm'
];
const SUSPICIOUS_QUERY_KEYWORDS = [
  'login',
  'verify',
  'account',
  'secure',
  'update',
  'password',
  'redirect',
  'continue',
  'session',
  'token',
  'auth'
];
const SENSITIVE_QUERY_PARAMS = [
  'password',
  'pass',
  'otp',
  'pin',
  'token',
  'session',
  'auth',
  'redirect'
];

function countSubdomains(hostname) {
  if (!hostname) return 0;
  if (IPV4_HOST_REGEX.test(hostname)) return 0;

  const parts = hostname.split('.').filter(Boolean);
  if (parts.length <= 2) return 0;
  return parts.length - 2;
}

function countKeywordHits(html) {
  const lowered = String(html || '').toLowerCase();
  return SUSPICIOUS_KEYWORDS.reduce((count, keyword) => {
    return count + (lowered.includes(keyword) ? 1 : 0);
  }, 0);
}

function countMatches(value, pattern) {
  const matches = String(value || '').match(pattern);
  return matches ? matches.length : 0;
}

function countDigits(value) {
  return countMatches(value, /\d/g);
}

function countSpecialCharacters(value) {
  return countMatches(value, /[^a-z0-9]/gi);
}

function hasShortenerDomain(hostname) {
  return SHORTENER_DOMAINS.has(String(hostname || '').toLowerCase());
}

function hasSuspiciousTld(hostname) {
  const parts = String(hostname || '').toLowerCase().split('.');
  const tld = parts[parts.length - 1] || '';
  return SUSPICIOUS_TLDS.has(tld);
}

function collectKeywordFlags(html) {
  const lowered = String(html || '').toLowerCase();
  return {
    keyword_login: Number(lowered.includes('login')),
    keyword_verify: Number(lowered.includes('verify')),
    keyword_account: Number(lowered.includes('account')),
    keyword_secure: Number(lowered.includes('secure')),
    keyword_update: Number(lowered.includes('update')),
    keyword_password: Number(lowered.includes('password')),
    keyword_urgent: Number(lowered.includes('urgent')),
    keyword_confirm: Number(lowered.includes('confirm')),
    keyword_signin: Number(lowered.includes('signin'))
  };
}

function countKeywordListHits(value, keywords) {
  const lowered = String(value || '').toLowerCase();
  return keywords.reduce((count, keyword) => count + (lowered.includes(keyword) ? 1 : 0), 0);
}

function getPathDepth(pathname) {
  return String(pathname || '')
    .split('/')
    .filter(Boolean)
    .length;
}

function countEncodedSegments(value) {
  return countMatches(String(value || ''), /%[0-9a-f]{2}/gi);
}

function getQueryParamCount(searchParams) {
  let count = 0;
  for (const _ of searchParams.entries()) {
    count += 1;
  }
  return count;
}

function countSensitiveQueryParams(searchParams) {
  let count = 0;

  for (const [key] of searchParams.entries()) {
    const loweredKey = String(key || '').toLowerCase();
    if (SENSITIVE_QUERY_PARAMS.some((param) => loweredKey.includes(param))) {
      count += 1;
    }
  }

  return count;
}

async function resolveIpAddress(hostname) {
  if (!hostname) return null;

  try {
    const lookup = await dns.lookup(hostname);
    return lookup.address || null;
  } catch (error) {
    return null;
  }
}

async function resolveMxExists(hostname) {
  if (!hostname) return false;

  try {
    const records = await dns.resolveMx(hostname);
    return Array.isArray(records) && records.length > 0;
  } catch (error) {
    return false;
  }
}

async function resolveNameserverCount(hostname) {
  if (!hostname) return 0;

  try {
    const records = await dns.resolveNs(hostname);
    return Array.isArray(records) ? records.length : 0;
  } catch (error) {
    return 0;
  }
}

function isExternalAction(actionValue, pageUrl) {
  if (!actionValue) return false;

  try {
    const actionUrl = new URL(actionValue, pageUrl);
    return actionUrl.hostname !== pageUrl.hostname;
  } catch (error) {
    return false;
  }
}

function isExternalAsset(assetValue, pageUrl) {
  if (!assetValue || assetValue.startsWith('#') || assetValue.startsWith('javascript:')) {
    return false;
  }

  try {
    const assetUrl = new URL(assetValue, pageUrl);
    return assetUrl.hostname !== pageUrl.hostname;
  } catch (error) {
    return false;
  }
}

async function extractFeatures({ inputUrl, response }) {
  const inputParsedUrl = new URL(inputUrl);
  const finalUrl = response?.request?.res?.responseUrl
    ? new URL(response.request.res.responseUrl)
    : inputParsedUrl;
  const pageHtml = String(response?.data || '');
  const $ = cheerio.load(pageHtml);

  const forms = $('form');
  const inputs = $('input');
  const passwordFieldCount = $('input[type="password"]').length;
  const hiddenInputCount = $('input[type="hidden"]').length;
  const iframeCount = $('iframe').length;
  const formActionTargets = forms
    .map((_, form) => ($(form).attr('action') || '').trim())
    .get();
  const linkTargets = $('a[href]')
    .map((_, anchor) => ($(anchor).attr('href') || '').trim())
    .get();
  const scriptTargets = $('script[src]')
    .map((_, script) => ($(script).attr('src') || '').trim())
    .get();
  const externalFormAction = formActionTargets.some((action) => isExternalAction(action, finalUrl));
  const externalFormActionCount = formActionTargets.filter((action) => isExternalAction(action, finalUrl)).length;
  const externalLinkCount = linkTargets.filter((href) => isExternalAsset(href, finalUrl)).length;
  const externalScriptCount = scriptTargets.filter((src) => isExternalAsset(src, finalUrl)).length;
  const emptyLinkCount = linkTargets.filter((href) => !href || href === '#' || href.toLowerCase().startsWith('javascript:void')).length;
  const mailtoLinkCount = linkTargets.filter((href) => href.toLowerCase().startsWith('mailto:')).length;
  const ipAddress = await resolveIpAddress(finalUrl.hostname);
  const mxRecordExists = await resolveMxExists(finalUrl.hostname);
  const nameserverCount = await resolveNameserverCount(finalUrl.hostname);
  const redirected = finalUrl.toString() !== new URL(inputUrl).toString();
  const redirectCount = Number(response?.request?._redirectable?._redirectCount || 0);
  const suspiciousKeywordHits = countKeywordHits(pageHtml);
  const keywordFlags = collectKeywordFlags(pageHtml);
  const finalDomainDiffersFromInput = finalUrl.hostname !== inputParsedUrl.hostname;
  const hostnameLength = finalUrl.hostname.length;
  const pathLength = finalUrl.pathname.length;
  const queryLength = finalUrl.search.length;
  const pathDepth = getPathDepth(finalUrl.pathname);
  const queryParamCount = getQueryParamCount(finalUrl.searchParams);
  const encodedPathCount = countEncodedSegments(finalUrl.pathname);
  const encodedQueryCount = countEncodedSegments(finalUrl.search);
  const suspiciousPathKeywordHits = countKeywordListHits(finalUrl.pathname, SUSPICIOUS_PATH_KEYWORDS);
  const suspiciousQueryKeywordHits = countKeywordListHits(finalUrl.search, SUSPICIOUS_QUERY_KEYWORDS);
  const sensitiveQueryParamHits = countSensitiveQueryParams(finalUrl.searchParams);
  const dotCount = countMatches(finalUrl.hostname, /\./g);
  const hyphenCount = countMatches(finalUrl.hostname, /-/g);
  const digitCount = countDigits(finalUrl.toString());
  const specialCharCount = countSpecialCharacters(finalUrl.pathname + finalUrl.search);
  const hasAtSymbol = finalUrl.toString().includes('@');
  const hasDoubleSlashInPath = finalUrl.pathname.includes('//');
  const punycodeInHost = finalUrl.hostname.includes('xn--');
  const domainIntel = await lookupDomainIntel(finalUrl.hostname);

  const features = {
    url: finalUrl.toString(),
    finalUrl: finalUrl.toString(),
    ipAddress,
    domain: finalUrl.hostname,
    usesHttps: finalUrl.protocol === 'https:',
    hasIpAddressInUrl: IPV4_HOST_REGEX.test(finalUrl.hostname),
    subdomainCount: countSubdomains(finalUrl.hostname),
    urlLength: finalUrl.toString().length,
    hostnameLength,
    pathLength,
    queryLength,
    pathDepth,
    queryParamCount,
    encodedPathCount,
    encodedQueryCount,
    suspiciousPathKeywordHits,
    suspiciousQueryKeywordHits,
    sensitiveQueryParamHits,
    dotCount,
    hyphenCount,
    digitCount,
    specialCharCount,
    hasAtSymbol,
    hasDoubleSlashInPath,
    hasShortenerDomain: hasShortenerDomain(finalUrl.hostname),
    hasPunycode: punycodeInHost,
    suspiciousTld: hasSuspiciousTld(finalUrl.hostname),
    formCount: forms.length,
    inputCount: inputs.length,
    passwordFieldCount,
    hiddenInputCount,
    hasPasswordField: passwordFieldCount > 0,
    hasExternalFormAction: externalFormAction,
    externalFormActionCount,
    iframeCount,
    externalLinkCount,
    externalScriptCount,
    emptyLinkCount,
    mailtoLinkCount,
    suspiciousKeywordHits,
    matchedKeywords: SUSPICIOUS_KEYWORDS.filter((keyword) => pageHtml.toLowerCase().includes(keyword)),
    keywordFlags,
    sslStatus: finalUrl.protocol === 'https:' ? 'HTTPS detected' : 'No HTTPS detected',
    dnsResolves: Boolean(ipAddress),
    mxRecordExists,
    nameserverCount,
    redirected,
    redirectCount,
    finalDomainDiffersFromInput,
    redirectTarget: redirected ? finalUrl.toString() : null,
    domainAge: domainIntel.domainAge,
    domainAgeDays: domainIntel.domainAgeDays,
    createdAt: domainIntel.createdAt,
    registrar: domainIntel.registrar
  };

  const modelFeatures = {
    uses_https: Number(features.usesHttps),
    has_ip_in_url: Number(features.hasIpAddressInUrl),
    subdomain_count: features.subdomainCount,
    url_length: features.urlLength,
    hostname_length: features.hostnameLength,
    path_length: features.pathLength,
    query_length: features.queryLength,
    path_depth: features.pathDepth,
    query_param_count: features.queryParamCount,
    encoded_path_count: features.encodedPathCount,
    encoded_query_count: features.encodedQueryCount,
    suspicious_path_keyword_hits: features.suspiciousPathKeywordHits,
    suspicious_query_keyword_hits: features.suspiciousQueryKeywordHits,
    sensitive_query_param_hits: features.sensitiveQueryParamHits,
    dot_count: features.dotCount,
    hyphen_count: features.hyphenCount,
    digit_count: features.digitCount,
    special_char_count: features.specialCharCount,
    has_at_symbol: Number(features.hasAtSymbol),
    has_double_slash_in_path: Number(features.hasDoubleSlashInPath),
    has_shortener_domain: Number(features.hasShortenerDomain),
    has_punycode: Number(features.hasPunycode),
    suspicious_tld: Number(features.suspiciousTld),
    form_count: features.formCount,
    input_count: features.inputCount,
    password_field_count: features.passwordFieldCount,
    hidden_input_count: features.hiddenInputCount,
    has_external_form_action: Number(features.hasExternalFormAction),
    iframe_count: features.iframeCount,
    external_link_count: features.externalLinkCount,
    external_script_count: features.externalScriptCount,
    suspicious_keyword_hits: features.suspiciousKeywordHits,
    redirect_count: features.redirectCount,
    final_domain_differs_from_input: Number(features.finalDomainDiffersFromInput),
    redirected: Number(features.redirected),
    ...features.keywordFlags
  };

  // Keep the model payload in a stable order for training and inference.
  const orderedModelFeatures = Object.fromEntries(
    MODEL_FEATURE_ORDER.map((featureName) => [featureName, Number(modelFeatures[featureName] || 0)])
  );

  return {
    features,
    modelFeatures: orderedModelFeatures
  };
}

module.exports = {
  extractFeatures
};
