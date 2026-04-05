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

function buildRiskScore(phishingProbability) {
  const normalizedProbability = clamp(Number(phishingProbability) || 0, 0, 1);
  return Math.round(normalizedProbability * 100);
}

function buildBehaviorAssessment(features) {
  const reasons = [];
  let score = 0;
  let hardFlag = false;
  const trustedLegitimateDomain = Boolean(features.knownLegitimateDomain);

  const add = (points, reason) => {
    score += points;
    reasons.push(reason);
  };

  if (!features.usesHttps) add(16, 'The page does not use HTTPS.');
  if (features.hasIpAddressInUrl) add(24, 'The URL uses an IP address instead of a normal domain.');
  if (features.hasShortenerDomain) add(10, 'The URL uses a shortened-link service.');
  if (features.hasPunycode) add(24, 'The hostname contains punycode, which can hide lookalike domains.');
  if (features.suspiciousTld) add(10, 'The domain uses a higher-risk top-level domain.');
  if (features.finalDomainDiffersFromInput) add(10, 'The final destination domain differs from the submitted domain.');
  if (features.redirectCount >= 2) add(10, 'The page uses multiple redirects.');
  if (features.sensitiveQueryParamHits > 0) add(12, 'Sensitive-looking query parameters were found in the URL.');
  if (features.hasAtSymbol) add(12, 'The URL contains an @ symbol, which is commonly abused in phishing URLs.');
  if (features.urlLength >= 90) add(8, 'The URL is unusually long.');

  if (typeof features.domainAgeDays === 'number' && features.domainAgeDays >= 0 && features.domainAgeDays < 30) {
    add(12, 'The domain appears to be very new.');
  } else if (typeof features.domainAgeDays === 'number' && features.domainAgeDays < 180) {
    add(6, 'The domain appears to be relatively new.');
  }

  if (!features.dnsResolves) add(16, 'The hostname did not resolve cleanly during lookup.');
  const hasOldDomain = typeof features.domainAgeDays === 'number' && features.domainAgeDays >= 365;
  const cleanUrlShape =
    !features.hasIpAddressInUrl &&
    !features.hasPunycode &&
    !features.hasShortenerDomain &&
    !features.suspiciousTld &&
    !features.hasAtSymbol;

  if (features.hasExternalFormAction && features.hasPasswordField) {
    add(24, 'A credential-related form submits data to an external domain.');
  } else if (features.hasExternalFormAction && !trustedLegitimateDomain) {
    if (hasOldDomain && cleanUrlShape && !features.hasPasswordField) {
      add(8, 'A form submits data to an external domain, but the site otherwise looks established.');
    } else {
      add(24, 'A form submits data to an external domain.');
    }
  } else if (features.hasExternalFormAction && trustedLegitimateDomain && !features.hasPasswordField) {
    add(4, 'A form submits data to an external service, which can happen on legitimate sites.');
  }

  if (features.hasPasswordField && !features.usesHttps) {
    add(22, 'A password field is present on a page without HTTPS.');
    hardFlag = true;
  }

  if (features.hasPasswordField && features.hasExternalFormAction) {
    add(30, 'A password form appears to submit to a different domain.');
    hardFlag = true;
  }

  if (features.hasIpAddressInUrl && features.hasPasswordField) {
    add(30, 'The page requests credentials while using an IP-based URL.');
    hardFlag = true;
  }

  if (features.hasPunycode && features.hasPasswordField) {
    add(26, 'A lookalike-domain signal appears together with a credential form.');
    hardFlag = true;
  }

  if (
    features.suspiciousKeywordHits >= 3 &&
    (features.hasPasswordField || features.hasExternalFormAction || features.suspiciousPathKeywordHits > 0)
  ) {
    add(14, 'The page uses phishing-related language together with login-style behavior.');
  }

  if (features.reputationFlagged) {
    add(42, 'A browser-style reputation service flagged this URL as unsafe.');
    hardFlag = true;
  }

  if (features.localDatasetFlagged) {
    add(38, 'This URL matched a known phishing entry in the local phishing dataset.');
    hardFlag = true;
  }

  if (trustedLegitimateDomain && !hardFlag && !features.hasPasswordField) {
    score = Math.min(score, 8);
  }

  return {
    score: clamp(Math.round(score), 0, 100),
    reasons,
    hardFlag
  };
}

function buildFinalRiskScore(modelRiskScore, behaviorAssessment, features) {
  const trustedLegitimateDomain = Boolean(features.knownLegitimateDomain);
  const noCredentialCollection = !features.hasPasswordField;
  const noCredentialRiskBehavior = !features.hasPasswordField && !behaviorAssessment.hardFlag;
  const hasEstablishedDomain = typeof features.domainAgeDays === 'number' && features.domainAgeDays >= 365;
  const cleanUrlShape =
    !features.hasIpAddressInUrl &&
    !features.hasPunycode &&
    !features.hasShortenerDomain &&
    !features.suspiciousTld &&
    !features.hasAtSymbol;

  if (trustedLegitimateDomain && noCredentialCollection && !behaviorAssessment.hardFlag) {
    const hasSuspiciousUrlSignals =
      features.suspiciousPathKeywordHits > 0 ||
      features.suspiciousQueryKeywordHits > 0 ||
      features.sensitiveQueryParamHits > 0 ||
      features.redirectCount > 0;
    const isPlainRootLikeUrl =
      features.pathDepth === 0 &&
      features.queryParamCount === 0 &&
      features.pathLength <= 1 &&
      !hasSuspiciousUrlSignals;
    const isNormalTrustedSubpage =
      features.pathDepth <= 3 &&
      features.queryParamCount <= 1 &&
      features.pathLength <= 48 &&
      !hasSuspiciousUrlSignals;
    const safeTrustedCap = hasSuspiciousUrlSignals
      ? ((Number(modelRiskScore) || 0) <= 25 ? 8 : 12)
      : (isPlainRootLikeUrl
        ? ((Number(modelRiskScore) || 0) <= 25 ? 4 : 8)
        : (isNormalTrustedSubpage
          ? ((Number(modelRiskScore) || 0) <= 25 ? 10 : 14)
          : ((Number(modelRiskScore) || 0) <= 25 ? 8 : 12)));
    return clamp(Math.min(Number(modelRiskScore) || 0, safeTrustedCap), 0, safeTrustedCap);
  }

  let finalScore = Math.round((Number(modelRiskScore) * 0.78) + (Number(behaviorAssessment.score) * 0.22));

  if (features.reputationFlagged) {
    finalScore = Math.max(finalScore, behaviorAssessment.score, 88);
  }

  if (features.localDatasetFlagged) {
    finalScore = Math.max(finalScore, behaviorAssessment.score, 84);
  }

  if (behaviorAssessment.hardFlag) {
    finalScore = Math.max(finalScore, behaviorAssessment.score, 78);
  }

  if (trustedLegitimateDomain && Number(modelRiskScore) <= 20 && noCredentialCollection && cleanUrlShape && noCredentialRiskBehavior) {
    finalScore = Math.min(finalScore, 10);
  } else if (trustedLegitimateDomain && noCredentialCollection && cleanUrlShape && noCredentialRiskBehavior) {
    finalScore = Math.min(finalScore, 15);
  } else if (trustedLegitimateDomain && cleanUrlShape && behaviorAssessment.score < 35 && !behaviorAssessment.hardFlag) {
    finalScore = Math.min(finalScore, 24);
  } else if (trustedLegitimateDomain && cleanUrlShape && !behaviorAssessment.hardFlag) {
    finalScore = Math.min(finalScore, 38);
  } else if (
    hasEstablishedDomain &&
    noCredentialCollection &&
    cleanUrlShape &&
    !features.reputationFlagged &&
    !features.localDatasetFlagged &&
    behaviorAssessment.score <= 24 &&
    !behaviorAssessment.hardFlag
  ) {
    finalScore = Math.min(finalScore, 38);
  }

  return clamp(finalScore, 0, 100);
}

function buildFinalPrediction(modelRiskScore, behaviorAssessment, finalRiskScore) {
  const features = arguments[3] || {};
  const hasEstablishedDomain = typeof features.domainAgeDays === 'number' && features.domainAgeDays >= 365;
  const cleanUrlShape =
    !features.hasIpAddressInUrl &&
    !features.hasPunycode &&
    !features.hasShortenerDomain &&
    !features.suspiciousTld &&
    !features.hasAtSymbol;

  if (finalRiskScore <= 15) return 'Safe';
  if (finalRiskScore <= 25) return 'Safe';
  if (
    hasEstablishedDomain &&
    !features.hasPasswordField &&
    !features.reputationFlagged &&
    !features.localDatasetFlagged &&
    cleanUrlShape &&
    behaviorAssessment.score <= 24 &&
    finalRiskScore <= 40
  ) {
    return 'Safe';
  }
  if (behaviorAssessment.hardFlag) return 'Phishing';
  if (modelRiskScore >= 85) return 'Phishing';
  if (modelRiskScore >= 70 && behaviorAssessment.score >= 25) return 'Phishing';
  if (finalRiskScore >= 70) return 'Phishing';
  return 'Safe';
}

module.exports = {
  buildRiskScore,
  buildBehaviorAssessment,
  buildFinalPrediction,
  buildFinalRiskScore,
  getGradeFromRiskScore,
  getRiskClass,
  getRiskLevel
};
