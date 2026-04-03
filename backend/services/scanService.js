const axios = require('axios');
const { extractFeatures } = require('./featureExtractor');
const { predictPhishingRisk } = require('./aiPredictionService');
const {
  buildBehaviorAssessment,
  buildFinalPrediction,
  buildFinalRiskScore,
  buildRiskScore,
  getGradeFromRiskScore,
  getRiskClass,
  getRiskLevel
} = require('../utils/riskScoring');

function clampProbability(value) {
  return Math.min(Math.max(Number(value) || 0, 0), 1);
}

function buildFallbackPredictionPayload(behaviorAssessment, features) {
  const trustedLegitimateDomain = Boolean(features.knownLegitimateDomain);
  const baseProbability = clampProbability(behaviorAssessment.score / 100);
  let phishingProbability = baseProbability;

  if (behaviorAssessment.hardFlag) {
    phishingProbability = Math.max(baseProbability, 0.88);
  } else if (trustedLegitimateDomain) {
    phishingProbability = Math.min(baseProbability, 0.18);
  } else if (behaviorAssessment.score >= 60) {
    phishingProbability = Math.max(baseProbability, 0.72);
  }

  return {
    prediction: phishingProbability >= 0.7 ? 1 : 0,
    confidence: clampProbability(Math.max(0.55, Math.min(0.9, 0.45 + (behaviorAssessment.score / 100) * 0.45))),
    phishing_probability: phishingProbability
  };
}

async function fetchWebsite(url) {
  try {
    return await axios.get(url, {
      timeout: 8000,
      maxRedirects: 5,
      responseType: 'text',
      validateStatus(status) {
        return status >= 200 && status < 400;
      },
      headers: {
        'User-Agent': 'PhishNetAI/1.0 URL Scanner'
      }
    });
  } catch (error) {
    const code = error.code || '';

    if (code === 'ECONNABORTED') {
      const timeoutError = new Error('The website took too long to respond.');
      timeoutError.statusCode = 504;
      throw timeoutError;
    }

    if (['ENOTFOUND', 'EAI_AGAIN'].includes(code)) {
      const dnsError = new Error('The website could not be reached. Please check the URL and try again.');
      dnsError.statusCode = 502;
      throw dnsError;
    }

    if (error.response) {
      const httpError = new Error(`The website responded with status ${error.response.status}.`);
      httpError.statusCode = 502;
      throw httpError;
    }

    const networkError = new Error('The website could not be fetched right now.');
    networkError.statusCode = 502;
    throw networkError;
  }
}

function buildIndicators(features, riskScore, heuristicReasons = []) {
  const indicators = [];

  if (features.knownLegitimateDomain) {
    indicators.push('This website matches a domain from the trusted site list.');
  }
  indicators.push(features.usesHttps ? 'The site uses a secure connection.' : 'The site does not appear to use a secure connection.');
  indicators.push(features.hasIpAddressInUrl ? 'The link uses a raw IP address instead of a normal website name.' : 'The link uses a normal website name.');
  indicators.push(features.hasPasswordField ? `This page asks for a password in ${features.passwordFieldCount} field(s).` : 'This page does not appear to ask for a password.');
  indicators.push(features.hasExternalFormAction ? `Some form actions send data outside the current site (${features.externalFormActionCount} found).` : 'The forms appear to stay within the same site.');
  indicators.push(features.redirected ? `The link redirected ${features.redirectCount} time(s) before reaching the final page.` : 'The link did not redirect to another page.');
  indicators.push(features.hasShortenerDomain ? 'The link uses a shortened URL service.' : 'The link does not use a known shortened URL service.');
  indicators.push(features.hasPunycode ? 'The website name contains characters that can hide a lookalike domain.' : 'No hidden lookalike-domain pattern was detected in the website name.');
  indicators.push(features.suspiciousTld ? 'The site uses a domain ending that is more often seen in risky links.' : 'The domain ending does not match the higher-risk list.');
  indicators.push(`The link structure has ${features.pathDepth} path level(s) and ${features.queryParamCount} extra parameter(s).`);
  indicators.push(`Encoded link characters found: ${features.encodedPathCount + features.encodedQueryCount}.`);
  indicators.push(`Suspicious link clues found in the URL: ${features.suspiciousPathKeywordHits + features.suspiciousQueryKeywordHits}, with ${features.sensitiveQueryParamHits} sensitive parameter clue(s).`);
  indicators.push(features.finalDomainDiffersFromInput ? 'The final website name is different from the one you originally entered.' : 'The final website name matches the one you entered.');
  indicators.push(features.dnsResolves ? 'The website name could be reached normally.' : 'The website name could not be reached normally during the scan.');
  indicators.push(features.mxRecordExists ? 'Basic domain records were found for this site.' : 'Some expected domain records were not found for this site.');
  indicators.push(`Detected ${features.nameserverCount} nameserver record(s) for the domain.`);
  indicators.push(features.domainAge !== 'Unavailable' ? `Estimated domain age: ${features.domainAge}.` : 'The scanner could not confirm how old this domain is.');
  if (features.registrar) {
    indicators.push('Registrar information is available for this domain.');
  }
  indicators.push(`Page structure found: ${features.iframeCount} embedded frame(s), ${features.externalLinkCount} outside link(s), and ${features.externalScriptCount} outside script(s).`);
  indicators.push(`Other page elements found: ${features.emptyLinkCount} empty link(s) and ${features.mailtoLinkCount} email link(s).`);

  if (features.suspiciousKeywordHits > 0) {
    indicators.push(`Words often seen in phishing pages were found: ${features.matchedKeywords.join(', ')}.`);
  } else {
    indicators.push('No obvious phishing-related words were found on the page.');
  }

  indicators.push(`The page contains ${features.formCount} form(s), ${features.inputCount} input field(s), and ${features.hiddenInputCount} hidden input(s).`);
  indicators.push(`Overall scan risk score: ${riskScore}%.`);
  heuristicReasons.forEach((reason) => indicators.push(`Scanner note: ${reason}`));

  return indicators;
}

function buildSummary(prediction, features, riskScore, behaviorAssessment, modelRiskScore) {
  if (prediction === 'Phishing') {
    return 'This URL shows multiple phishing-like signals from both the AI model and the rule-based scan, so it should be treated as risky.';
  }

  if (features.knownLegitimateDomain && modelRiskScore <= 20 && behaviorAssessment.score <= 10) {
    return 'This URL matches a trusted legitimate-domain pattern, and the scan did not find strong phishing behavior on the page.';
  }

  if (riskScore >= 35 || behaviorAssessment.score >= 35 || features.hasPasswordField || features.hasExternalFormAction) {
    return 'The URL is not classified as phishing, but the scanner still found signals that deserve caution.';
  }

  return 'The scanned page looks relatively safe based on the current URL and HTML checks.';
}

function buildRecommendation(prediction, riskScore) {
  if (prediction === 'Phishing') {
    return 'Do not enter credentials or personal information. Close the page and verify the link through an official source.';
  }

  if (riskScore >= 35) {
    return 'Proceed carefully. Double-check the domain and avoid logging in unless you trust the source.';
  }

  return 'The site appears safer than typical phishing pages, but it is still best to verify the URL before sharing sensitive data.';
}

function cleanExcerpt(value, maxLength = 120) {
  const cleaned = String(value || '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim();

  if (!cleaned) return '';
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trim()}...`;
}

function buildPageOverview(features) {
  const pageContext = features.pageContext || {};
  const title = cleanExcerpt(pageContext.title, 70);
  const heading = cleanExcerpt(pageContext.mainHeading, 70);
  const description = cleanExcerpt(pageContext.metaDescription, 120);
  const snippet = cleanExcerpt(pageContext.snippet, 110);

  const parts = [];

  if (title && heading && title.toLowerCase() !== heading.toLowerCase()) {
    parts.push(`This page appears to be "${title}" and prominently shows "${heading}".`);
  } else if (title) {
    parts.push(`This page appears to be "${title}".`);
  } else if (heading) {
    parts.push(`The page is presenting itself as "${heading}".`);
  }

  if (description) {
    parts.push(`The page description suggests: "${description}".`);
  } else if (snippet) {
    parts.push(`The visible page content mentions: "${snippet}".`);
  }

  if (parts.length === 0) {
    return 'A short page overview could not be extracted from the website content.';
  }

  return parts.join(' ');
}

async function scanUrl(url) {
  const response = await fetchWebsite(url);
  const { features, modelFeatures } = await extractFeatures({ inputUrl: url, response });
  const behaviorAssessment = buildBehaviorAssessment(features);
  let predictionPayload;
  let aiFallback = null;

  try {
    predictionPayload = await predictPhishingRisk(modelFeatures);
  } catch (error) {
    aiFallback = {
      used: true,
      statusCode: error.statusCode || 503,
      message: error.message || 'AI prediction service unavailable.'
    };
    predictionPayload = buildFallbackPredictionPayload(behaviorAssessment, features);
  }

  const numericPrediction = Number(predictionPayload.prediction) === 1 ? 1 : 0;
  const confidence = Number(predictionPayload.confidence) || 0;
  const phishingProbability = Number(predictionPayload.phishing_probability);
  const modelRiskScore = buildRiskScore(
    Number.isFinite(phishingProbability) ? phishingProbability : confidence
  );
  const riskScore = buildFinalRiskScore(modelRiskScore, behaviorAssessment, features);
  const prediction = buildFinalPrediction(modelRiskScore, behaviorAssessment, riskScore);

  const indicators = buildIndicators(features, riskScore, behaviorAssessment.reasons);
  if (aiFallback?.used) {
    indicators.push('Scanner note: The AI prediction service was temporarily unavailable, so this result used the rule-based scan fallback.');
  }

  return {
    prediction,
    confidence: Number((confidence * 100).toFixed(2)),
    riskScore,
    urlRiskScore: modelRiskScore,
    behaviorRiskScore: behaviorAssessment.score,
    modelRiskScore,
    heuristicRiskScore: behaviorAssessment.score,
    knownLegitimateDomain: Boolean(features.knownLegitimateDomain),
    grade: getGradeFromRiskScore(riskScore),
    riskLevel: getRiskLevel(riskScore),
    riskClass: getRiskClass(riskScore),
    indicators,
    summary: buildSummary(prediction, features, riskScore, behaviorAssessment, modelRiskScore),
    pageOverview: buildPageOverview(features),
    recommendation: buildRecommendation(prediction, riskScore),
    heuristicReasons: behaviorAssessment.reasons,
    aiFallback,
    features,
    modelFeatures,
    url: features.finalUrl
  };
}

module.exports = {
  scanUrl
};
