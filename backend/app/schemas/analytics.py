from pydantic import BaseModel

class AnalyticsOverview(BaseModel):
    total_users: int
    total_projects: int
    total_opportunities: int
    total_applications: int