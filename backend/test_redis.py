from app.utils.redis_client import redis_client

try:
    print(redis_client.ping())

except Exception as e:
    print("Redis Error:", e)