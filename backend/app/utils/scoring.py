def update_activity_score(user, points, db):
    user.activity_score = max(
        0,
        min(100, user.activity_score + points)
    )
    db.commit()
    db.refresh(user)


def recalculate_user_scores(user, db):
    project_count = len(user.projects)
    skill_count = len(user.skills)
    app_count = len(user.applications)

    activity = (
        50
        + (project_count * 10)
        + (skill_count * 3)
        + (app_count * 5)
    )

    user.activity_score = max(
        0,
        min(100, activity)
    )

    accepted_count = sum(
        1
        for a in user.applications
        if a.status == "accepted"
    )

    rejected_count = sum(
        1
        for a in user.applications
        if a.status == "rejected"
    )

    reliability = (
        50
        + (accepted_count * 15)
        - (rejected_count * 10)
    )

    user.reliability_score = max(
        0,
        min(100, reliability)
    )

    db.commit()
    db.refresh(user)