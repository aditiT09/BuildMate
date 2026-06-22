from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.opportunity import Opportunity
from app.models.opportunity_skill import OpportunitySkill
from app.models.skill import Skill

from app.schemas.opportunity_skill import OpportunitySkillCreate

from app.utils.security import get_current_user
from app.utils.redis_client import redis_client


router = APIRouter(
    prefix="/opportunity-skills",
    tags=["Opportunity Skills"]
)


@router.post("/")
def add_opportunity_skill(
    data: OpportunitySkillCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # Validate skill exists
    skill = db.query(Skill).filter(Skill.id == data.skill_id).first()
    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    opportunity = (
        db.query(Opportunity)
        .filter(Opportunity.id == data.opportunity_id)
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    # The project owner is the one allowed to modify opportunity details
    if opportunity.project.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    existing = (
        db.query(OpportunitySkill)
        .filter(
            OpportunitySkill.opportunity_id == data.opportunity_id,
            OpportunitySkill.skill_id == data.skill_id
        )
        .first()
    )

    if existing:
        return {
            "message": "Already added"
        }

    opportunity_skill = OpportunitySkill(
        opportunity_id=data.opportunity_id,
        skill_id=data.skill_id
    )

    db.add(opportunity_skill)

    db.commit()

    try:
        redis_client.flushall()
    except Exception:
        pass

    db.refresh(opportunity_skill)

    return opportunity_skill


@router.get("/{opportunity_id}")
def get_opportunity_skills_by_opportunity(
    opportunity_id: int,
    db: Session = Depends(get_db)
):

    skills = (
        db.query(OpportunitySkill)
        .filter(
            OpportunitySkill.opportunity_id == opportunity_id
        )
        .all()
    )

    return [
        {
            "id": item.skill.id,
            "name": item.skill.name
        }
        for item in skills
    ]


@router.delete("/{opportunity_id}/skills/{skill_id}")
def remove_opportunity_skill(
    opportunity_id: int,
    skill_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    opportunity = (
        db.query(Opportunity)
        .filter(Opportunity.id == opportunity_id)
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    if opportunity.project.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    opportunity_skill = (
        db.query(OpportunitySkill)
        .filter(
            OpportunitySkill.opportunity_id == opportunity_id,
            OpportunitySkill.skill_id == skill_id
        )
        .first()
    )

    if not opportunity_skill:
        raise HTTPException(
            status_code=404,
            detail="Opportunity skill association not found"
        )

    db.delete(opportunity_skill)
    db.commit()

    try:
        redis_client.flushall()
    except Exception:
        pass

    return {"message": "Opportunity skill removed"}
