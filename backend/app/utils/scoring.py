def update_activity_score(user, points, db):
    user.activity_score += points
    db.commit()
    db.refresh(user)