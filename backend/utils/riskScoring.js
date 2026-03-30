function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getGradeFromRiskScore(riskScore) {
  if (riskScore <= 5) return 'A+';
  if (riskScore <= 10) return 'A';
  if (riskScore <= 20) return 'B+';
  if (riskScore <= 30) return 'B';
  if (riskScore <= 40) return 'C+';
  if (riskScore <= 55) return 'C';
  if (riskScore <= 70) return 'D+';
  if (riskScore <= 85) return 'D';
  return 'F';
}

function getRiskLevel(riskScore) {
  if (riskScore <= 25) return 'Low Risk';
  if (riskScore <= 60) return 'Medium Risk';
  return 'High Risk';
}

function getRiskClass(riskScore) {
  if (riskScore <= 25) return 'low';
  if (riskScore <= 60) return 'medium';
  return 'high';
}

function buildRiskScore(prediction, confidence) {
  const normalizedConfidence = clamp(Number(confidence) || 0, 0, 1);
  const phishingProbability = prediction === 1
    ? normalizedConfidence
    : (1 - normalizedConfidence);

  return Math.round(clamp(phishingProbability * 100, 0, 100));
}

function buildHeuristicAssessment(features) {
  const reasons = [];
  let score = 0;
  let hardFlag = false;

  const add = (points, reason) => {
    score += points;
    reasons.push(reason);
  };

  if (!features.usesHttps) add(14, 'The page does not use HTTPS.');
  if (features.hasIpAddressInUrl) add(24, 'The URL uses an IP address instead of a normal domain.');
  if (features.hasShortenerDomain) add(14, 'The URL uses a shortened-link service.');
  if (features.hasPunycode) add(22, 'The hostname contains punycode, which can hide lookalike domains.');
  if (features.suspiciousTld) add(10, 'The domain uses a higher-risk top-level domain.');
  if (features.finalDomainDiffersFromInput) add(12, 'The final destination domain differs from the submitted domain.');
  if (features.redirectCount >= 2) add(Math.min(16, features.redirectCount * 4), 'The page uses multiple redirects.');
  if (features.subdomainCount >= 3) add(Math.min(14, features.subdomainCount * 4), 'The URL has an unusually high number of subdomains.');
  if (features.pathDepth >= 4) add(Math.min(10, features.pathDepth * 2), 'The URL path is unusually deep.');
  if (features.queryParamCount >= 5) add(8, 'The URL contains many query parameters.');
  if (features.encodedPathCount > 0 || features.encodedQueryCount > 0) add(8, 'The URL contains encoded characters in the path or query.');
  if (features.suspiciousPathKeywordHits >= 2) add(12, 'The endpoint path contains multiple phishing-related keywords.');
  if (features.suspiciousQueryKeywordHits >= 2) add(10, 'The query string contains multiple phishing-related keywords.');
  if (features.sensitiveQueryParamHits > 0) add(14, 'Sensitive-looking query parameters were found in the URL.');
  if (features.hasAtSymbol) add(12, 'The URL contains an @ symbol, which is commonly abused in phishing URLs.');
  if (features.hasDoubleSlashInPath) add(8, 'The path contains a double slash pattern.');
  if (features.urlLength >= 90) add(10, 'The URL is unusually long.');
  if (features.hostnameLength >= 30) add(8, 'The hostname is unusually long.');
  if (features.hyphenCount >= 2) add(6, 'The hostname uses multiple hyphens.');
  if (features.digitCount >= 8) add(6, 'The URL contains many digits.');
  if (features.specialCharCount >= 12) add(6, 'The URL contains many special characters.');
  if (features.iframeCount > 0) add(8, 'The page includes iframe elements.');
  if (features.externalScriptCount >= 5) add(10, 'The page loads many external scripts.');
  if (features.externalLinkCount >= 10) add(6, 'The page contains many external links.');
  if (features.hiddenInputCount >= 3) add(8, 'The page contains several hidden input fields.');
  if (features.suspiciousKeywordHits >= 3) add(Math.min(15, features.suspiciousKeywordHits * 3), 'Several phishing-related keywords were found in the page content.');
  if (!features.dnsResolves) add(18, 'The hostname did not resolve cleanly during lookup.');
  if (features.nameserverCount === 0) add(8, 'No nameserver records were found during lookup.');
  if (typeof features.domainAgeDays === 'number' && features.domainAgeDays >= 0 && features.domainAgeDays < 30) {
    add(18, 'The domain appears to be very new.');
  } else if (typeof features.domainAgeDays === 'number' && features.domainAgeDays < 180) {
    add(10, 'The domain appears to be relatively new.');
  }

  if (features.hasPasswordField && !features.usesHttps) {
    add(18, 'A password field is present on a page without HTTPS.');
  }

  if (features.hasExternalFormAction) {
    add(20, 'A form submits data to an external domain.');
  }

  if (features.hasPasswordField && features.hasExternalFormAction) {
    add(24, 'A password form appears to submit to a different domain.');
    hardFlag = true;
  }

  if (features.hasIpAddressInUrl && features.hasPasswordField) {
    add(24, 'The page requests credentials while using an IP-based URL.');
    hardFlag = true;
  }

  if (features.hasPunycode && features.suspiciousKeywordHits >= 2) {
    add(18, 'Lookalike-domain signals appear together with phishing language.');
    hardFlag = true;
  }

  return {
    score: clamp(Math.round(score), 0, 100),
    reasons,
    hardFlag
  };
}

function buildHybridRiskScore(modelRiskScore, heuristicScore, hardFlag) {
  const blended = Math.round((Number(modelRiskScore) * 0.58) + (Number(heuristicScore) * 0.42));

  if (hardFlag) {
    return clamp(Math.max(blended, heuristicScore, 72), 0, 100);
  }

  return clamp(blended, 0, 100);
}

module.exports = {
  buildRiskScore,
  buildHeuristicAssessment,
  buildHybridRiskScore,
  getGradeFromRiskScore,
  getRiskClass,
  getRiskLevel
};
