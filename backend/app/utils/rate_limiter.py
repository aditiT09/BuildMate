import sys
from fastapi import HTTPException
from app.utils.redis_client import redis_client

_testing_override = False

def check_auth_rate_limit(ip: str, email: str = None):
    """
    Rate limiter for authentication actions (login & registration).
    Limits IP to 10 requests per minute and email to 5 requests per minute.
    Fails open if Redis connection is lost.
    """
    # Skip rate limiting when running tests, unless override is enabled
    if "pytest" in sys.modules and not _testing_override:
        return

    # 1. Rate limit by client IP (Login/Register attempts)
    ip_key = f"rate_limit:auth:ip:{ip}"
    try:
        ip_count = redis_client.incr(ip_key)
        if ip_count == 1:
            redis_client.expire(ip_key, 60)
        if ip_count > 10:
            raise HTTPException(
                status_code=429,
                detail="Too many attempts from this IP. Please try again in a minute."
            )
    except HTTPException:
        raise
    except Exception:
        # Fail open in case Redis is down
        pass

    # 2. Rate limit by target email (Login brute-forcing attempts)
    if email:
        email_key = f"rate_limit:auth:email:{email.strip().lower()}"
        try:
            email_count = redis_client.incr(email_key)
            if email_count == 1:
                redis_client.expire(email_key, 60)
            if email_count > 5:
                raise HTTPException(
                    status_code=429,
                    detail="Too many attempts for this email. Please try again in a minute."
                )
        except HTTPException:
            raise
        except Exception:
            # Fail open
            pass
