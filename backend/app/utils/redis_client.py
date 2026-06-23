import redis

from app.config import settings

redis_client = redis.from_url(
    settings.REDIS_URL,
    decode_responses=True
)

def invalidate_project_cache(project_id: int, db):
    try:
        redis_client.delete(f"buildmate:project_matches:{project_id}")
        redis_client.delete(f"buildmate:project_rankings:{project_id}")
        from app.models.opportunity import Opportunity
        opportunities = db.query(Opportunity.id).filter(Opportunity.project_id == project_id).all()
        for opp in opportunities:
            redis_client.delete(f"buildmate:opportunity_matches:{opp.id}")
    except Exception:
        pass

def invalidate_opportunity_cache(opp_id: int):
    try:
        redis_client.delete(f"buildmate:opportunity_matches:{opp_id}")
    except Exception:
        pass

def invalidate_all_matching_caches():
    try:
        keys = list(redis_client.scan_iter("buildmate:*"))
        if keys:
            redis_client.delete(*keys)
    except Exception:
        pass