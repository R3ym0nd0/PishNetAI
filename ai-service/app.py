import os
from pathlib import Path

from flask import Flask, jsonify, request

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "phishing_model.joblib"
_model_bundle = None
_model = None
_feature_columns = None


def load_or_train_model():
    global _model_bundle, _model, _feature_columns

    if _model_bundle is not None and _model is not None and _feature_columns is not None:
        return _model_bundle, _model, _feature_columns

    import joblib
    from train_model import FEATURE_COLUMNS, train_and_save_model

    if not MODEL_PATH.exists():
        train_and_save_model()

    _model_bundle = joblib.load(MODEL_PATH)
    _model = _model_bundle["model"]
    _feature_columns = FEATURE_COLUMNS
    return _model_bundle, _model, _feature_columns


app = Flask(__name__)


@app.post("/api/predict")
def predict():
    import pandas as pd

    payload = request.get_json(silent=True) or {}
    _, model, feature_columns = load_or_train_model()

    try:
        row = {column: float(payload.get(column, 0)) for column in feature_columns}
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid feature payload."}), 400

    frame = pd.DataFrame([row], columns=feature_columns)
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
