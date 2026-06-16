from app.database import SessionLocal
from app.models.skill import Skill

db = SessionLocal()
try:
    skills = db.query(Skill).all()
    print(f"Total skills in DB: {len(skills)}")
    for s in skills:
        print(f"- {s.name} (ID: {s.id})")
finally:
    db.close()
