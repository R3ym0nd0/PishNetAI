import os
from pathlib import Path

import joblib
import pandas as pd
from flask import Flask, jsonify, request

from train_model import FEATURE_COLUMNS, train_and_save_model


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "phishing_model.joblib"


def load_or_train_model():
    if not MODEL_PATH.exists():
        train_and_save_model()

    return joblib.load(MODEL_PATH)


app = Flask(__name__)
model_bundle = load_or_train_model()
model = model_bundle["model"]


@app.post("/api/predict")
def predict():
    payload = request.get_json(silent=True) or {}

    try:
        row = {column: float(payload.get(column, 0)) for column in FEATURE_COLUMNS}
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid feature payload."}), 400

    frame = pd.DataFrame([row], columns=FEATURE_COLUMNS)
    probabilities = model.predict_proba(frame)[0]
    predicted_class = int(model.predict(frame)[0])
    phishing_probability = float(probabilities[1]) if len(probabilities) > 1 else float(probabilities[0])
    confidence = float(probabilities[predicted_class])

    return jsonify({
        "prediction": predicted_class,
        "confidence": round(confidence, 4),
        "phishing_probability": round(phishing_probability, 4)
    })


@app.get("/health")
def health():
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5001)),
        debug=False
    )
