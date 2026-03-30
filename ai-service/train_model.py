from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier


BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "data" / "sample_training_data.csv"
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "phishing_model.joblib"

FEATURE_COLUMNS = [
    "uses_https",
    "has_ip_in_url",
    "subdomain_count",
    "url_length",
    "hostname_length",
    "path_length",
    "query_length",
    "path_depth",
    "query_param_count",
    "encoded_path_count",
    "encoded_query_count",
    "suspicious_path_keyword_hits",
    "suspicious_query_keyword_hits",
    "sensitive_query_param_hits",
    "dot_count",
    "hyphen_count",
    "digit_count",
    "special_char_count",
    "has_at_symbol",
    "has_double_slash_in_path",
    "has_shortener_domain",
    "has_punycode",
    "suspicious_tld",
    "form_count",
    "input_count",
    "password_field_count",
    "hidden_input_count",
    "has_external_form_action",
    "iframe_count",
    "external_link_count",
    "external_script_count",
    "keyword_login",
    "keyword_verify",
    "keyword_account",
    "keyword_secure",
    "keyword_update",
    "keyword_password",
    "keyword_urgent",
    "keyword_confirm",
    "keyword_signin",
    "suspicious_keyword_hits",
    "redirect_count",
    "final_domain_differs_from_input",
    "redirected",
]

TARGET_COLUMN = "label"


def train_and_save_model():
    dataset = pd.read_csv(DATASET_PATH)
    features = dataset[FEATURE_COLUMNS]
    labels = dataset[TARGET_COLUMN]

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=8,
        random_state=42
    )
    model.fit(features, labels)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "model": model,
            "features": FEATURE_COLUMNS,
        },
        MODEL_PATH
    )

    return MODEL_PATH


if __name__ == "__main__":
    output_path = train_and_save_model()
    print(f"Model saved to {output_path}")
