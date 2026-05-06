import hashlib
import os
import time
from collections import defaultdict, deque
from threading import Lock

try:
    from redis import Redis
except ImportError:  # pragma: no cover - optional dependency in local environments
    Redis = None  # type: ignore[assignment]

request_buckets: dict[str, deque[float]] = defaultdict(deque)
_redis_client = None
_redis_client_lock = Lock()


def reset_rate_limit_state() -> None:
    request_buckets.clear()
    global _redis_client
    _redis_client = None


def allow_request(key: str, max_requests: int, window_seconds: int, now: float | None = None) -> bool:
    backend = os.getenv("AI_RATE_LIMIT_BACKEND", "memory").lower().strip()
    if backend == "redis":
        return _allow_request_redis(key=key, max_requests=max_requests, window_seconds=window_seconds)
    return _allow_request_memory(key=key, max_requests=max_requests, window_seconds=window_seconds, now=now)


def build_rate_limit_key(client_host: str | None, api_key: str | None = None) -> str:
    identity_source = (api_key or "").strip() or (client_host or "unknown").strip() or "unknown"
    identity_hash = hashlib.sha256(identity_source.encode("utf-8")).hexdigest()[:16]
    prefix = "api_key" if api_key else "ip"
    return f"{prefix}:{identity_hash}"


def _allow_request_memory(key: str, max_requests: int, window_seconds: int, now: float | None = None) -> bool:
    if max_requests <= 0 or window_seconds <= 0:
        return True

    current_time = now if now is not None else time.time()
    bucket = request_buckets[key]
    threshold = current_time - window_seconds

    while bucket and bucket[0] < threshold:
        bucket.popleft()

    if len(bucket) >= max_requests:
        return False

    bucket.append(current_time)
    return True


def _allow_request_redis(key: str, max_requests: int, window_seconds: int) -> bool:
    if max_requests <= 0 or window_seconds <= 0:
        return True
    client = _get_redis_client()
    if client is None:
        # Fallback resiliente: no bloquea inferencia si Redis no esta disponible.
        return _allow_request_memory(key=key, max_requests=max_requests, window_seconds=window_seconds)

    redis_key = f"ai-rate-limit:{key}"
    try:
        current = int(client.incr(redis_key))
        if current == 1:
            client.expire(redis_key, window_seconds)
        return current <= max_requests
    except Exception:
        # Fallback a memoria ante problemas de conectividad/timeout.
        return _allow_request_memory(key=key, max_requests=max_requests, window_seconds=window_seconds)


def _get_redis_client():
    global _redis_client
    if _redis_client is not None:
        return _redis_client

    redis_url = os.getenv("AI_REDIS_URL", "").strip()
    if not redis_url or Redis is None:
        return None

    with _redis_client_lock:
        if _redis_client is not None:
            return _redis_client
        _redis_client = Redis.from_url(redis_url, decode_responses=True, socket_timeout=1)
    return _redis_client
