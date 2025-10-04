import Link from "next/link";

import GymCard from "../../../components/GymCard";
import OfferCard from "../../../components/OfferCard";
import ReviewList from "../../../components/ReviewList";
import EmptyState from "../../../components/EmptyState";
import { api } from "../../../lib/api";

interface PageProps {
  params: { gymId: string };
}

export default async function GymDetailPage({ params }: PageProps) {
  const id = Number(params.gymId);
  const gym = await api.getGym(id);
  const reviews = await api.getGymReviews(id);
  const offers = await api.listGymOffers({ gym_id: id });

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem", display: "grid", gap: "1.75rem" }}>
      <section className="card" style={{ display: "grid", gap: "1rem" }}>
        <GymCard gym={gym} />
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href={`/offers/gyms?gym_id=${gym.id}`} className="cta-button">
            Xem ưu đãi của gym
          </Link>
          <Link href={`/gyms/${gym.id}/pts`} className="cta-button" style={{ background: "#f97316" }}>
            Danh sách PT đang cộng tác
          </Link>
        </div>
      </section>

      <section>
        <header className="section-title">Ưu đãi hiện có</header>
        {offers.length === 0 ? (
          <EmptyState
            title="Chưa có ưu đãi"
            description="Khi phòng gym đăng ưu đãi và được phê duyệt bạn sẽ thấy tại đây."
          />
        ) : (
          <div className="card-grid">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </section>

      <section>
        <header className="section-title">Đánh giá từ học viên</header>
        <ReviewList reviews={reviews} />
      </section>
    </div>
  );
}
