const axios = require('axios');
const { extractFeatures } = require('./featureExtractor');
const { predictPhishingRisk } = require('./aiPredictionService');
const { buildHeuristicAssessment, buildHybridRiskScore, buildRiskScore, getGradeFromRiskScore, getRiskClass, getRiskLevel } = require('../utils/riskScoring');

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

  indicators.push(features.usesHttps ? 'HTTPS is enabled.' : 'HTTPS is not enabled.');
  indicators.push(features.hasIpAddressInUrl ? 'The URL uses an IP address instead of a domain.' : 'The URL uses a named domain.');
  indicators.push(features.hasPasswordField ? `Detected ${features.passwordFieldCount} password field(s).` : 'No password field was detected.');
  indicators.push(features.hasExternalFormAction ? `Detected ${features.externalFormActionCount} external form action(s).` : 'Forms stay on the same domain.');
  indicators.push(features.redirected ? `The request redirected ${features.redirectCount} time(s) to ${features.redirectTarget}.` : 'No redirect was detected.');
  indicators.push(features.hasShortenerDomain ? 'The URL uses a shortened-link domain.' : 'The URL does not use a known shortener.');
  indicators.push(features.hasPunycode ? 'The hostname contains punycode, which can hide lookalike domains.' : 'No punycode was detected in the hostname.');
  indicators.push(features.suspiciousTld ? 'The domain uses a higher-risk top-level domain.' : 'The top-level domain is not in the higher-risk list.');
  indicators.push(`The endpoint path depth is ${features.pathDepth}, with ${features.queryParamCount} query parameter(s).`);
  indicators.push(`Detected ${features.encodedPathCount} encoded path segment(s) and ${features.encodedQueryCount} encoded query segment(s).`);
  indicators.push(`Detected ${features.suspiciousPathKeywordHits} suspicious path keyword hit(s), ${features.suspiciousQueryKeywordHits} suspicious query keyword hit(s), and ${features.sensitiveQueryParamHits} sensitive query parameter hit(s).`);
  indicators.push(features.finalDomainDiffersFromInput ? 'The final destination domain differs from the submitted domain.' : 'The destination domain matches the submitted domain.');
  indicators.push(features.dnsResolves ? 'The domain resolved to an IP address.' : 'The domain did not resolve cleanly.');
  indicators.push(features.mxRecordExists ? 'MX records were found for the domain.' : 'No MX records were found for the domain.');
  indicators.push(`Detected ${features.nameserverCount} nameserver record(s).`);
  indicators.push(features.domainAge !== 'Unavailable' ? `Estimated domain age: ${features.domainAge}.` : 'Domain age information was not available from the registry.');
  if (features.registrar) {
    indicators.push(`Registrar information was detected for this domain.`);
  }
  indicators.push(`Observed ${features.iframeCount} iframe(s), ${features.externalLinkCount} external link(s), and ${features.externalScriptCount} external script(s).`);
  indicators.push(`Detected ${features.emptyLinkCount} empty link(s) and ${features.mailtoLinkCount} mailto link(s).`);

  if (features.suspiciousKeywordHits > 0) {
    indicators.push(`Suspicious keywords detected: ${features.matchedKeywords.join(', ')}.`);
  } else {
    indicators.push('No suspicious keywords were detected in the HTML.');
  }

  indicators.push(`Observed ${features.formCount} form(s), ${features.inputCount} input field(s), and ${features.hiddenInputCount} hidden input(s).`);
  indicators.push(`Computed phishing risk score: ${riskScore}%.`);
  heuristicReasons.forEach((reason) => indicators.push(`Evidence: ${reason}`));

  return indicators;
}

function buildSummary(prediction, features, riskScore, heuristicAssessment) {
  if (prediction === 'Phishing') {
    return 'This URL shows multiple phishing-like signals from both the AI model and the rule-based scan, so it should be treated as risky.';
  }

  if (riskScore >= 35 || heuristicAssessment.score >= 35 || features.hasPasswordField || features.hasExternalFormAction) {
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

async function scanUrl(url) {
  const response = await fetchWebsite(url);
  const { features, modelFeatures } = await extractFeatures({ inputUrl: url, response });
  const predictionPayload = await predictPhishingRisk(modelFeatures);
  const numericPrediction = Number(predictionPayload.prediction) === 1 ? 1 : 0;
  const confidence = Number(predictionPayload.confidence) || 0;
  const modelRiskScore = buildRiskScore(numericPrediction, confidence);
  const heuristicAssessment = buildHeuristicAssessment(features);
  const riskScore = buildHybridRiskScore(modelRiskScore, heuristicAssessment.score, heuristicAssessment.hardFlag);
  const prediction = (numericPrediction === 1 || heuristicAssessment.hardFlag || riskScore >= 60) ? 'Phishing' : 'Safe';

  return {
    prediction,
    confidence: Number((confidence * 100).toFixed(2)),
    riskScore,
    modelRiskScore,
    heuristicRiskScore: heuristicAssessment.score,
    grade: getGradeFromRiskScore(riskScore),
    riskLevel: getRiskLevel(riskScore),
    riskClass: getRiskClass(riskScore),
    indicators: buildIndicators(features, riskScore, heuristicAssessment.reasons),
    summary: buildSummary(prediction, features, riskScore, heuristicAssessment),
    recommendation: buildRecommendation(prediction, riskScore),
    heuristicReasons: heuristicAssessment.reasons,
    features,
    modelFeatures,
    url: features.finalUrl
  };
}

module.exports = {
  scanUrl
};
