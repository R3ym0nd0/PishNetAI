# Backend Scan Pipeline

This folder contains the Node.js scanning pipeline for the PhishNet AI URL scanner.

## Flow

1. Validate the submitted URL.
2. Fetch the target page with Axios.
3. Parse HTML with Cheerio.
4. Extract model-ready phishing features.
5. Send those features to the Python AI service.
6. Return a unified response to the frontend.

## Optional Reputation Check

The scanner can also use a browser-style reputation lookup to catch URLs that are already flagged by threat-intelligence services.

Set this environment variable to enable it:

- `SAFE_BROWSING_API_KEY`

When enabled, a flagged URL can raise the final score and add a strong warning in the scanner result even if the visible page checks look mostly normal.

## Model Input Mapping

The Python model expects the features in this exact order:

1. `uses_https`
2. `has_ip_in_url`
3. `subdomain_count`
4. `url_length`
5. `hostname_length`
6. `path_length`
7. `query_length`
8. `path_depth`
9. `query_param_count`
10. `encoded_path_count`
11. `encoded_query_count`
12. `suspicious_path_keyword_hits`
13. `suspicious_query_keyword_hits`
14. `sensitive_query_param_hits`
15. `dot_count`
16. `hyphen_count`
17. `digit_count`
18. `special_char_count`
19. `has_at_symbol`
20. `has_double_slash_in_path`
21. `has_shortener_domain`
22. `has_punycode`
23. `suspicious_tld`
24. `form_count`
25. `input_count`
26. `password_field_count`
27. `hidden_input_count`
28. `has_external_form_action`
29. `iframe_count`
30. `external_link_count`
31. `external_script_count`
32. `keyword_login`
33. `keyword_verify`
34. `keyword_account`
35. `keyword_secure`
36. `keyword_update`
37. `keyword_password`
38. `keyword_urgent`
39. `keyword_confirm`
40. `keyword_signin`
41. `suspicious_keyword_hits`
42. `redirect_count`
43. `final_domain_differs_from_input`
44. `redirected`
