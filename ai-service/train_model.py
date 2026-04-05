from __future__ import annotations

import ipaddress
from pathlib import Path
from urllib.parse import parse_qsl, urlparse

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.model_selection import train_test_split


BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
DATA_DIR = BASE_DIR / "data"
SAMPLE_DATASET_PATH = DATA_DIR / "sample_training_data.csv"
LEGITIMATE_SOURCE_PATH = PROJECT_ROOT / "top-1m.csv"
PHISHING_SOURCE_PATH = PROJECT_ROOT / "verified_online.csv"
DERIVED_DATASET_PATH = DATA_DIR / "url_training_data.csv"
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "phishing_model.joblib"

MAX_LEGITIMATE_ROWS = 60000
MAX_PHISHING_ROWS = 60000
RANDOM_STATE = 42

SHORTENER_DOMAINS = {
    "bit.ly",
    "tinyurl.com",
    "goo.gl",
    "t.co",
    "is.gd",
    "ow.ly",
    "buff.ly",
    "rebrand.ly",
    "cutt.ly",
    "shorturl.at",
}

SUSPICIOUS_TLDS = {
    "xyz",
    "top",
    "click",
    "gq",
    "tk",
    "ml",
    "work",
    "support",
    "country",
}

URL_KEYWORDS = [
    "login",
    "verify",
    "account",
    "secure",
    "update",
    "password",
    "urgent",
    "confirm",
    "signin",
]

SUSPICIOUS_PATH_KEYWORDS = [
    "login",
    "signin",
    "verify",
    "account",
    "secure",
    "update",
    "auth",
    "wallet",
    "billing",
    "confirm",
]

SUSPICIOUS_QUERY_KEYWORDS = [
    "login",
    "verify",
    "account",
    "secure",
    "update",
    "password",
    "redirect",
    "continue",
    "session",
    "token",
    "auth",
]

SENSITIVE_QUERY_PARAMS = [
    "password",
    "pass",
    "otp",
    "pin",
    "token",
    "session",
    "auth",
    "redirect",
]

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


def normalize_url(raw_value: str) -> str:
    candidate = str(raw_value or "").strip()
    if not candidate:
        return ""

    if "://" not in candidate:
        candidate = f"https://{candidate}"

    parsed = urlparse(candidate)
    if not parsed.hostname:
        return ""

    return parsed.geturl()


def has_ip_address(hostname: str) -> bool:
    try:
        ipaddress.ip_address(hostname)
        return True
    except ValueError:
        return False


def count_subdomains(hostname: str) -> int:
    if not hostname or has_ip_address(hostname):
        return 0

    parts = [part for part in hostname.split(".") if part]
    if len(parts) <= 2:
        return 0
    return len(parts) - 2


def count_occurrences(value: str, token: str) -> int:
    return str(value or "").count(token)


def count_keyword_hits(value: str, keywords: list[str]) -> int:
    lowered = str(value or "").lower()
    return sum(1 for keyword in keywords if keyword in lowered)


def count_sensitive_query_params(search: str) -> int:
    count = 0
    for key, _ in parse_qsl(search, keep_blank_values=True):
        lowered = key.lower()
        if any(marker in lowered for marker in SENSITIVE_QUERY_PARAMS):
            count += 1
    return count


def extract_url_features(url: str) -> dict[str, int]:
    parsed = urlparse(url)
    hostname = (parsed.hostname or "").lower()
    full_url = parsed.geturl()
    path = parsed.path or ""
    query = parsed.query or ""
    query_with_prefix = f"?{query}" if query else ""
    keyword_flags = {f"keyword_{keyword}": int(keyword in full_url.lower()) for keyword in URL_KEYWORDS}

    features = {
        "uses_https": int(parsed.scheme == "https"),
        "has_ip_in_url": int(has_ip_address(hostname)),
        "subdomain_count": count_subdomains(hostname),
        "url_length": len(full_url),
        "hostname_length": len(hostname),
        "path_length": len(path),
        "query_length": len(query_with_prefix),
        "path_depth": len([segment for segment in path.split("/") if segment]),
        "query_param_count": len(parse_qsl(query, keep_blank_values=True)),
        "encoded_path_count": count_occurrences(path.lower(), "%"),
        "encoded_query_count": count_occurrences(query_with_prefix.lower(), "%"),
        "suspicious_path_keyword_hits": count_keyword_hits(path, SUSPICIOUS_PATH_KEYWORDS),
        "suspicious_query_keyword_hits": count_keyword_hits(query_with_prefix, SUSPICIOUS_QUERY_KEYWORDS),
        "sensitive_query_param_hits": count_sensitive_query_params(query),
        "dot_count": count_occurrences(hostname, "."),
        "hyphen_count": count_occurrences(hostname, "-"),
        "digit_count": sum(character.isdigit() for character in full_url),
        "special_char_count": sum(not character.isalnum() for character in f"{path}{query_with_prefix}"),
        "has_at_symbol": int("@" in full_url),
        "has_double_slash_in_path": int("//" in path),
        "has_shortener_domain": int(hostname in SHORTENER_DOMAINS),
        "has_punycode": int("xn--" in hostname),
        "suspicious_tld": int((hostname.split(".")[-1] if hostname else "") in SUSPICIOUS_TLDS),
        "form_count": 0,
        "input_count": 0,
        "password_field_count": 0,
        "hidden_input_count": 0,
        "has_external_form_action": 0,
        "iframe_count": 0,
        "external_link_count": 0,
        "external_script_count": 0,
        "suspicious_keyword_hits": count_keyword_hits(full_url, URL_KEYWORDS),
        "redirect_count": 0,
        "final_domain_differs_from_input": 0,
        "redirected": 0,
        **keyword_flags,
    }

    return {column: int(features.get(column, 0)) for column in FEATURE_COLUMNS}


def load_legitimate_urls() -> pd.DataFrame:
    if not LEGITIMATE_SOURCE_PATH.exists():
        raise FileNotFoundError(f"Legitimate dataset not found: {LEGITIMATE_SOURCE_PATH}")

    dataset = pd.read_csv(
        LEGITIMATE_SOURCE_PATH,
        header=None,
        names=["rank", "domain"],
        usecols=["domain"],
    )
    dataset["url"] = dataset["domain"].map(normalize_url)
    dataset = dataset[dataset["url"] != ""].drop_duplicates(subset=["url"])

    if len(dataset) > MAX_LEGITIMATE_ROWS:
        dataset = dataset.sample(MAX_LEGITIMATE_ROWS, random_state=RANDOM_STATE)

    dataset["label"] = 0
    return dataset[["url", "label"]]


def load_phishing_urls() -> pd.DataFrame:
    if not PHISHING_SOURCE_PATH.exists():
        raise FileNotFoundError(f"Phishing dataset not found: {PHISHING_SOURCE_PATH}")

    dataset = pd.read_csv(PHISHING_SOURCE_PATH)
    required_columns = {"url", "verified", "online"}
    missing_columns = required_columns.difference(dataset.columns)
    if missing_columns:
        raise ValueError(f"Missing columns in phishing dataset: {sorted(missing_columns)}")

    filtered = dataset[
        dataset["verified"].astype(str).str.lower().eq("yes")
        & dataset["online"].astype(str).str.lower().eq("yes")
    ].copy()
    filtered["url"] = filtered["url"].map(normalize_url)
    filtered = filtered[filtered["url"] != ""].drop_duplicates(subset=["url"])

    if len(filtered) > MAX_PHISHING_ROWS:
        filtered = filtered.sample(MAX_PHISHING_ROWS, random_state=RANDOM_STATE)

    filtered["label"] = 1
    return filtered[["url", "label"]]


def build_dataset_from_url_sources() -> pd.DataFrame:
    legitimate = load_legitimate_urls()
    phishing = load_phishing_urls()
    combined = pd.concat([legitimate, phishing], ignore_index=True)
    feature_rows = combined["url"].map(extract_url_features).apply(pd.Series)
    dataset = pd.concat([feature_rows, combined[[TARGET_COLUMN]]], axis=1)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    dataset.to_csv(DERIVED_DATASET_PATH, index=False)
    return dataset


def load_training_dataset() -> tuple[pd.DataFrame, str]:
    if LEGITIMATE_SOURCE_PATH.exists() and PHISHING_SOURCE_PATH.exists():
        return build_dataset_from_url_sources(), "derived-url-datasets"

    return pd.read_csv(SAMPLE_DATASET_PATH), "sample-training-data"


def train_and_save_model() -> Path:
    dataset, dataset_source = load_training_dataset()
    features = dataset[FEATURE_COLUMNS]
    labels = dataset[TARGET_COLUMN]

    train_x, test_x, train_y, test_y = train_test_split(
        features,
        labels,
        test_size=0.2,
        random_state=RANDOM_STATE,
        stratify=labels,
    )

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=14,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight="balanced_subsample",
        random_state=RANDOM_STATE,
        n_jobs=1,
    )
    model.fit(train_x, train_y)

    probabilities = model.predict_proba(test_x)[:, 1]
    predictions = model.predict(test_x)
    metrics = {
        "dataset_source": dataset_source,
        "row_count": int(len(dataset)),
        "accuracy": round(float(accuracy_score(test_y, predictions)), 4),
        "roc_auc": round(float(roc_auc_score(test_y, probabilities)), 4),
    }

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "model": model,
            "features": FEATURE_COLUMNS,
            "metrics": metrics,
        },
        MODEL_PATH,
    )

    return MODEL_PATH


if __name__ == "__main__":
    output_path = train_and_save_model()
    print(f"Model saved to {output_path}")