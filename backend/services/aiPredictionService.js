const axios = require('axios');

const DEFAULT_AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5001/api/predict';
const AI_SERVICE_TIMEOUT_MS = Number(process.env.AI_SERVICE_TIMEOUT_MS || 20000);

async function predictPhishingRisk(modelFeatures) {
  try {
    const response = await axios.post(
      DEFAULT_AI_SERVICE_URL,
      modelFeatures,
      {
        timeout: AI_SERVICE_TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    const details = error.response?.data?.error || error.message;
    const serviceError = new Error(`AI service unavailable: ${details}`);
    serviceError.statusCode = error.response?.status || 503;
    throw serviceError;
  }
}

module.exports = {
  predictPhishingRisk
};
