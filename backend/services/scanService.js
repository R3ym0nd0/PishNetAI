const axios = require('axios');
const { extractFeatures } = require('./featureExtractor');
const { predictPhishingRisk } = require('./aiPredictionService');
const { lookupUrlReputation } = require('./reputationService');
const { lookupLocalPhishingDataset } = require('./localPhishingDatasetService');
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

function buildIndicators(features, riskScore, heuristicReasons = [], modelRiskScore = 0, prediction = 'Safe') {
  const indicators = [];
  const aiDrivenPhishingRisk =
    prediction === 'Phishing' &&
    modelRiskScore >= 70 &&
    features.usesHttps &&
    !features.hasPasswordField &&
    !features.hasExternalFormAction &&
    !features.hasIpAddressInUrl &&
    !features.hasPunycode &&
    !features.suspiciousTld;

  if (features.localDatasetFlagged) {
    const datasetTarget = features.localDatasetTarget ? ` targeting ${features.localDatasetTarget}` : '';
    indicators.unshift(`This link matched a known phishing entry${datasetTarget}.`);
  }

  if (features.reputationFlagged) {
    const threatTypes = Array.isArray(features.reputationThreatTypes) && features.reputationThreatTypes.length > 0
      ? ` (${features.reputationThreatTypes.join(', ').toLowerCase().replace(/_/g, ' ')})`
      : '';
    indicators.unshift(`A trusted security source flagged this link as unsafe${threatTypes}.`);
  }

  if (features.knownLegitimateDomain) {
    indicators.push(
      features.usesHttps
        ? 'This website matches a trusted domain on our safe-site list.'
        : 'This website matches a trusted domain, but the current page is not using a secure connection.'
    );
  }
  indicators.push(features.usesHttps ? 'The site uses a secure connection (HTTPS).' : 'The site does not appear to use a secure connection.');
  indicators.push(features.hasIpAddressInUrl ? 'The link uses an IP address instead of a normal website name.' : 'The link uses a normal website name.');
  indicators.push(features.hasPasswordField ? `This page asks for a password in ${features.passwordFieldCount} field(s).` : 'No password field was detected.');
  indicators.push(features.hasExternalFormAction ? `Some forms may send your information to another website (${features.externalFormActionCount} found).` : 'Forms appear to stay within the same website.');
  indicators.push(features.redirected ? `This link redirected ${features.redirectCount} time(s) before reaching the final page.` : 'The link did not redirect to another page.');
  indicators.push(features.hasShortenerDomain ? 'This link uses a shortened URL service.' : 'This link does not use a known shortened URL service.');
  indicators.push(features.hasPunycode ? 'The website name contains hidden characters that may be trying to imitate a real site.' : 'No hidden lookalike-domain pattern was found in the website name.');
  indicators.push(features.suspiciousTld ? 'This site uses a domain ending that appears more often in risky links.' : 'The domain ending does not match our higher-risk list.');
  indicators.push(`The link has ${features.pathDepth} path level(s) and ${features.queryParamCount} extra parameter(s).`);
  indicators.push(`Encoded characters found in the link: ${features.encodedPathCount + features.encodedQueryCount}.`);
  indicators.push(`The link includes ${features.suspiciousPathKeywordHits + features.suspiciousQueryKeywordHits} suspicious URL clue(s) and ${features.sensitiveQueryParamHits} sensitive parameter clue(s).`);
  indicators.push(features.finalDomainDiffersFromInput ? 'The final website name is different from the one you first entered.' : 'The final website name matches the one you entered.');
  indicators.push(features.dnsResolves ? 'The website could be reached during the scan.' : 'The website could not be reached normally during the scan.');
  indicators.push(features.mxRecordExists ? 'Basic domain records were found for this website.' : 'Some expected domain records were not found for this website.');
  indicators.push(`The domain has ${features.nameserverCount} nameserver record(s).`);
  indicators.push(features.domainAge !== 'Unavailable' ? `Estimated domain age: ${features.domainAge}.` : 'The scanner could not confirm how old this domain is.');
  if (features.registrar) {
    indicators.push('Registrar information is available for this domain.');
  }
  indicators.push(`The page includes ${features.iframeCount} embedded frame(s), ${features.externalLinkCount} outside link(s), and ${features.externalScriptCount} outside script(s).`);
  indicators.push(`Other page elements found: ${features.emptyLinkCount} empty link(s) and ${features.mailtoLinkCount} email link(s).`);

  if (features.suspiciousKeywordHits > 0) {
    indicators.push(`The page uses words often seen in phishing attempts: ${features.matchedKeywords.join(', ')}.`);
  } else {
    indicators.push('No obvious phishing-related words were found on the page.');
  }

  if (aiDrivenPhishingRisk) {
    indicators.unshift('The page looked mostly normal in basic checks, but the AI model still flagged this URL as high risk.');
  } else if (modelRiskScore >= 70) {
    indicators.push('The AI model found strong phishing-like patterns in this URL.');
  } else if (modelRiskScore >= 45 && riskScore >= 35) {
    indicators.push('The AI model found some risk patterns in this URL.');
  }

  indicators.push(`The page contains ${features.formCount} form(s), ${features.inputCount} input field(s), and ${features.hiddenInputCount} hidden input(s).`);
  indicators.push(`Overall scan risk score: ${riskScore}%.`);
  heuristicReasons.forEach((reason) => indicators.push(`Scanner note: ${reason}`));

  return indicators;
}

function buildSummary(prediction, features, riskScore, behaviorAssessment, modelRiskScore) {
  if (features.localDatasetFlagged) {
    return 'This link matched a known phishing entry in our local dataset, so it should be treated as high risk.';
  }

  if (features.reputationFlagged) {
    return 'A trusted security source already flagged this link as unsafe, so it should be treated as high risk.';
  }

  const aiDrivenPhishingRisk =
    prediction === 'Phishing' &&
    modelRiskScore >= 70 &&
    features.usesHttps &&
    !features.hasPasswordField &&
    !features.hasExternalFormAction &&
    !features.hasIpAddressInUrl &&
    !features.hasPunycode &&
    !features.suspiciousTld;

  if (prediction === 'Phishing') {
    if (aiDrivenPhishingRisk) {
      return 'The page looked mostly normal in basic checks, but the AI model still flagged this URL as high risk.';
    }
    return 'This link showed several warning signs, so it should be treated as risky.';
  }

  if (features.knownLegitimateDomain && modelRiskScore <= 20 && behaviorAssessment.score <= 10) {
    return 'This link matches a trusted domain pattern, and the scan did not find strong phishing signs on the page.';
  }

  if (
    features.knownLegitimateDomain &&
    features.usesHttps &&
    features.hasPasswordField &&
    !features.hasExternalFormAction &&
    !features.reputationFlagged &&
    !features.localDatasetFlagged &&
    riskScore <= 30
  ) {
    return 'This link points to a trusted website. The login page and redirects can be normal for a sign-in flow, but it is still smart to double-check the address before entering your password.';
  }

  if (riskScore >= 35 || behaviorAssessment.score >= 35 || features.hasPasswordField || features.hasExternalFormAction) {
    return 'This link was not classified as phishing, but the scanner still found a few signs that deserve caution.';
  }

  return 'The scanned page looks relatively safe based on the current link and page checks.';
}

function buildRecommendation(prediction, riskScore) {
  if (prediction === 'Phishing') {
    return 'Do not enter passwords or personal information. Close the page and verify the link through an official source.';
  }

  if (riskScore >= 35) {
    return 'You can visit this site, but stay careful with any form or page that asks for information.';
  }

  return 'This site looks safer than a typical phishing page, but it is still best to verify the link before sharing sensitive information.';
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

function buildPageOverviewWithRiskContext(features, prediction, riskScore, behaviorAssessment, modelRiskScore) {
  const baseOverview = buildPageOverview(features);
  if (features.localDatasetFlagged) {
    return 'This page may look normal, but the link matched a known phishing record in our local dataset.';
  }
  if (features.reputationFlagged) {
    return 'This page may look normal, but a trusted security source has already flagged this link as unsafe.';
  }
  const aiDrivenPhishingRisk =
    prediction === 'Phishing' &&
    modelRiskScore >= 70 &&
    features.usesHttps &&
    !features.hasPasswordField &&
    !features.hasExternalFormAction &&
    !features.hasIpAddressInUrl &&
    !features.hasPunycode &&
    !features.suspiciousTld;

  if (aiDrivenPhishingRisk) {
    return 'The page looked normal in basic checks, but the AI model still treated this link as high risk.';
  }

  if (prediction === 'Phishing' && riskScore >= 70) {
    return 'The page shows several suspicious signs that match a high-risk phishing result.';
  }

  return baseOverview;
}

function buildRecommendationWithRiskContext(prediction, riskScore, features, behaviorAssessment, modelRiskScore) {
  if (features.localDatasetFlagged) {
    return 'Avoid this link and do not enter any sensitive information. Treat it as a known phishing warning and verify through an official source.';
  }

  if (features.reputationFlagged) {
    return 'Avoid this link and do not enter any sensitive information. Verify it through an official source before visiting again.';
  }

  const aiDrivenPhishingRisk =
    prediction === 'Phishing' &&
    modelRiskScore >= 70 &&
    features.usesHttps &&
    !features.hasPasswordField &&
    !features.hasExternalFormAction &&
    !features.hasIpAddressInUrl &&
    !features.hasPunycode &&
    !features.suspiciousTld;

  if (aiDrivenPhishingRisk) {
    return 'Be careful and verify the link through an official source before using the page or sharing any sensitive information.';
  }

  if (
    features.knownLegitimateDomain &&
    features.usesHttps &&
    features.hasPasswordField &&
    !features.hasExternalFormAction &&
    !features.reputationFlagged &&
    !features.localDatasetFlagged &&
    riskScore <= 30
  ) {
    return 'This appears to be a trusted login page, but you should still confirm the website address before entering your password.';
  }

  if (
    prediction === 'Safe' &&
    riskScore >= 35 &&
    features.hasExternalFormAction &&
    !features.hasPasswordField &&
    !features.reputationFlagged &&
    !features.localDatasetFlagged
  ) {
    return 'You can visit this site, but stay careful with any form that sends information outside the website.';
  }

  return buildRecommendation(prediction, riskScore);
}

async function scanUrl(url) {
  const response = await fetchWebsite(url);
  const { features, modelFeatures } = await extractFeatures({ inputUrl: url, response });
  const rawLocalDatasetAssessment = lookupLocalPhishingDataset(features.finalUrl || url);
  const suppressBroadLegitimateDatasetHit =
    Boolean(features.knownLegitimateDomain) &&
    rawLocalDatasetAssessment.flagged &&
    rawLocalDatasetAssessment.target === 'Other' &&
    rawLocalDatasetAssessment.matchType === 'host-path';
  const localDatasetAssessment = suppressBroadLegitimateDatasetHit
    ? {
        ...rawLocalDatasetAssessment,
        flagged: false,
        matchType: null,
        target: null
      }
    : rawLocalDatasetAssessment;
  const reputationAssessment = await lookupUrlReputation(features.finalUrl || url);
  features.localDatasetChecked = Boolean(localDatasetAssessment.checked);
  features.localDatasetFlagged = Boolean(localDatasetAssessment.flagged);
  features.localDatasetSource = localDatasetAssessment.source || null;
  features.localDatasetMatchType = localDatasetAssessment.matchType || null;
  features.localDatasetTarget = localDatasetAssessment.target || null;
  features.reputationChecked = Boolean(reputationAssessment.checked);
  features.reputationProvider = reputationAssessment.provider || null;
  features.reputationFlagged = Boolean(reputationAssessment.flagged);
  features.reputationThreatTypes = Array.isArray(reputationAssessment.threatTypes) ? reputationAssessment.threatTypes : [];
  features.reputationLookupError = reputationAssessment.error || null;
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
  const prediction = buildFinalPrediction(modelRiskScore, behaviorAssessment, riskScore, features);

  const indicators = buildIndicators(features, riskScore, behaviorAssessment.reasons, modelRiskScore, prediction);
  if (aiFallback?.used) {
    indicators.push('Scanner note: The AI service was temporarily unavailable, so this result used the scanner fallback instead.');
  }
  if (reputationAssessment.enabled && !reputationAssessment.checked && reputationAssessment.error) {
    indicators.push('Scanner note: The extra reputation check was unavailable, so the result relied on the scanner only.');
  }

  return {
    prediction,
    confidence: Number((confidence * 100).toFixed(2)),
    riskScore,
    urlRiskScore: modelRiskScore,
    behaviorRiskScore: behaviorAssessment.score,
    modelRiskScore,
    heuristicRiskScore: behaviorAssessment.score,
    localDatasetChecked: Boolean(localDatasetAssessment.checked),
    localDatasetFlagged: Boolean(localDatasetAssessment.flagged),
    localDatasetTarget: localDatasetAssessment.target || null,
    reputationChecked: Boolean(reputationAssessment.checked),
    reputationFlagged: Boolean(reputationAssessment.flagged),
    reputationThreatTypes: Array.isArray(reputationAssessment.threatTypes) ? reputationAssessment.threatTypes : [],
    knownLegitimateDomain: Boolean(features.knownLegitimateDomain),
    grade: getGradeFromRiskScore(riskScore),
    riskLevel: getRiskLevel(riskScore),
    riskClass: getRiskClass(riskScore),
    indicators,
    summary: buildSummary(prediction, features, riskScore, behaviorAssessment, modelRiskScore),
    pageOverview: buildPageOverviewWithRiskContext(features, prediction, riskScore, behaviorAssessment, modelRiskScore),
    recommendation: buildRecommendationWithRiskContext(prediction, riskScore, features, behaviorAssessment, modelRiskScore),
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
