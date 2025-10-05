from __future__ import annotations

from datetime import datetime, timedelta

from sqlmodel import Session, select

from . import models
from .core.security import get_password_hash


def ensure_seed_data(session: Session) -> None:
    if session.exec(select(models.Gym)).first():
        return

    # Locations
    loc1 = models.Location(district="Quận 1", city="Hồ Chí Minh", latitude=10.7758, longitude=106.7004)
    loc2 = models.Location(district="Phú Nhuận", city="Hồ Chí Minh", latitude=10.7993, longitude=106.6806)
    session.add_all([loc1, loc2])
    session.flush()

    # Gyms
    gym1 = models.Gym(
        name="Future Fitness District 1",
        summary="Phòng tập 3 tầng, khu boxing, sauna, PT 1:1",
        thumbnail="https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=600&q=60",
        rating_avg=4.9,
        rating_count=128,
        price_min=690000,
        price_max=1590000,
        distance_km=2.4,
        location_id=loc1.id,
    )
    gym2 = models.Gym(
        name="Beast Mode Phú Nhuận",
        summary="Functional training, crossfit cage, personal coaching",
        thumbnail="https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=600&q=60",
        rating_avg=4.7,
        rating_count=96,
        price_min=590000,
        price_max=1290000,
        distance_km=4.2,
        location_id=loc2.id,
    )
    session.add_all([gym1, gym2])
    session.flush()

    # PT profiles
    pt1 = models.PTProfile(
        name="Coach Linh",
        avatar="https://images.unsplash.com/photo-1541534401786-2077eed87a74?auto=format&fit=crop&w=300&q=60",
        experience_years=6,
        price_per_session=800000,
        specialties="Body recomposition, Cross training",
        promoted=True,
    )
    pt2 = models.PTProfile(
        name="Coach Huy",
        avatar="https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=300&q=60",
        experience_years=4,
        price_per_session=550000,
        specialties="Fat loss, Strength",
        promoted=False,
    )
    session.add_all([pt1, pt2])
    session.flush()

    session.add_all(
        [
            models.GymPTLink(gym_id=gym1.id, pt_id=pt1.id),
            models.GymPTLink(gym_id=gym2.id, pt_id=pt1.id),
            models.GymPTLink(gym_id=gym2.id, pt_id=pt2.id),
        ]
    )

    now = datetime.utcnow()
    seven_days = timedelta(days=7)

    offer_gym1 = models.Offer(
        offer_type=models.OfferType.GYM,
        title="Miễn phí 7 ngày trải nghiệm",
        summary="Tặng 1 tuần tập luyện + đánh giá thể hình bởi PT lead.",
        valid_from=now,
        valid_to=now + seven_days,
        promoted=True,
        status=models.OfferStatus.APPROVED,
        gym_id=gym1.id,
    )
    offer_gym2 = models.Offer(
        offer_type=models.OfferType.GYM,
        title="Giảm 25% gói 3 tháng",
        summary="Ưu đãi thành viên mới kèm lớp yoga không giới hạn.",
        valid_from=now,
        valid_to=now + seven_days * 2,
        promoted=False,
        status=models.OfferStatus.PENDING,
        gym_id=gym2.id,
    )

    offer_pt1 = models.Offer(
        offer_type=models.OfferType.PT,
        title="Combo 10 buổi PT cá nhân",
        summary="Tặng thêm 2 buổi đánh giá dinh dưỡng.",
        valid_from=now,
        valid_to=now + seven_days * 3,
        promoted=True,
        status=models.OfferStatus.GYM_APPROVED,
        pt_id=pt1.id,
        gym_id=gym1.id,
    )
    offer_pt2 = models.Offer(
        offer_type=models.OfferType.PT,
        title="Buổi trải nghiệm 199k",
        summary="Phù hợp người mới bắt đầu, thiết kế giáo án riêng.",
        valid_from=now,
        valid_to=now + seven_days * 2,
        promoted=False,
        status=models.OfferStatus.PENDING,
        pt_id=pt2.id,
        gym_id=gym2.id,
    )

    session.add_all([offer_gym1, offer_gym2, offer_pt1, offer_pt2])
    session.flush()

    session.add_all(
        [
            models.Review(
                gym_id=gym1.id,
                author_name="Mai",
                rating=5,
                content="Phòng tập sạch sẽ, PT nhiệt tình, lịch linh hoạt.",
                created_at=now - timedelta(days=3),
            ),
            models.Review(
                gym_id=gym2.id,
                author_name="Tuấn",
                rating=4,
                content="Thiết bị mới, hơi đông vào giờ cao điểm nhưng vẫn ổn.",
                created_at=now - timedelta(days=6),
            ),
        ]
    )

    user = models.UserProfile(
        name="Nguyễn Khánh Linh",
        email="linh.nguyen@example.com",
        role="GYM_STAFF",
    )
    session.add(user)
    session.flush()

    session.add_all(
        [
            models.Bookmark(user_id=user.id, item_type="GYM", name=gym1.name, href=f"/gyms/{gym1.id}"),
            models.Bookmark(user_id=user.id, item_type="PT", name=pt1.name or "Coach", href=f"/pts/{pt1.id}"),
        ]
    )

    auth_user = models.AuthUser(
        email="linh.nguyen@example.com",
        hashed_password=get_password_hash("password123"),
        role="GYM_STAFF",
        profile_id=user.id,
    )
    session.add(auth_user)

    session.add_all(
        [
            models.ModerationItem(
                offer_id=offer_pt2.id,
                submitted_by_id=pt2.id,
                submitted_by_name=pt2.name or "Coach",
                submitted_by_role="PT",
                risk_score=0.42,
                flagged_labels="discount_high",
                escalated=True,
                submitted_at=now - timedelta(hours=1),
            ),
            models.ModerationItem(
                offer_id=offer_gym2.id,
                submitted_by_id=2,
                submitted_by_name="Reception Beast Mode",
                submitted_by_role="GYM_STAFF",
                risk_score=0.18,
                flagged_labels="",
                escalated=False,
                submitted_at=now - timedelta(hours=2),
            ),
        ]
    )

    session.add_all(
        [
            models.Report(
                offer_id=offer_pt1.id,
                reporter_name="Trần Minh",
                reason="PT không xuất hiện đúng giờ",
                status=models.ReportStatus.OPEN,
                created_at=now - timedelta(days=7),
            ),
            models.Report(
                offer_id=offer_gym1.id,
                reporter_name="Lưu Ly",
                reason="Ảnh offer chưa phản ánh thực tế",
                status=models.ReportStatus.INVESTIGATING,
                created_at=now - timedelta(days=9),
            ),
        ]
    )

    session.commit()
