import urllib.request
import json
import logging
from datetime import datetime, timedelta
from fastapi import APIRouter

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/currency", tags=["Currency & Exchange Rates"])

# Reliable fallback rates relative to base INR
FALLBACK_RATES = {
    "INR": 1.0,
    "USD": 0.0116,
    "EUR": 0.0109,
    "GBP": 0.0091,
    "CAD": 0.0164,
    "AUD": 0.0182,
    "JPY": 1.76,
    "CHF": 0.0103,
    "AED": 0.0426,
    "SGD": 0.0155,
}

_cache = {
    "rates": FALLBACK_RATES,
    "last_updated": None
}


@router.get("/rates")
def get_exchange_rates():
    """
    Fetch live currency exchange rates against INR with in-memory 1-hour caching.
    Uses free Open Exchange Rates API with automatic graceful fallback.
    """
    global _cache
    now = datetime.utcnow()

    # Serve from cache if refreshed within the last hour
    if _cache["last_updated"] and (now - _cache["last_updated"]) < timedelta(hours=1):
        return {
            "base": "INR",
            "rates": _cache["rates"],
            "cached": True,
            "last_updated": _cache["last_updated"].isoformat()
        }

    try:
        req = urllib.request.Request(
            "https://open.er-api.com/v6/latest/INR",
            headers={"User-Agent": "SuedoAtelier/1.0 (FlorenceLuxuryApp)"}
        )
        with urllib.request.urlopen(req, timeout=4) as response:
            if response.status == 200:
                raw = response.read().decode("utf-8")
                data = json.loads(raw)
                api_rates = data.get("rates", {})
                
                updated_rates = {
                    curr: float(api_rates[curr]) if curr in api_rates else fallback
                    for curr, fallback in FALLBACK_RATES.items()
                }
                _cache["rates"] = updated_rates
                _cache["last_updated"] = now
                return {
                    "base": "INR",
                    "rates": updated_rates,
                    "cached": False,
                    "last_updated": now.isoformat()
                }
    except Exception as exc:
        logger.warning(f"Live currency fetch encountered exception: {exc}. Retaining baseline rates.")

    return {
        "base": "INR",
        "rates": _cache["rates"],
        "cached": True,
        "fallback": True,
        "last_updated": (_cache["last_updated"] or now).isoformat()
    }
