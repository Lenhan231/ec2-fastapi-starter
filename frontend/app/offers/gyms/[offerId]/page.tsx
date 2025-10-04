import Link from "next/link";

import OfferCard from "../../../../components/OfferCard";
import EmptyState from "../../../../components/EmptyState";
import { api } from "../../../../lib/api";

interface PageProps {
  params: { offerId: string };
}

export default async function GymOfferDetailPage({ params }: PageProps) {
  const id = Number(params.offerId);
  const offer = await api.getGymOffer(id);
  const related = (await api.listGymOffers()).filter((item) => item.id !== offer.id).slice(0, 3);

  if (!offer) {
    return (
      <EmptyState
        title="Không tìm thấy ưu đãi"
        description="Ưu đãi có thể đã hết hạn hoặc bị gỡ."
        actionLabel="Quay lại danh sách"
        actionHref="/offers/gyms"
      />
    );
  }

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem", display: "grid", gap: "1.5rem" }}>
      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <span className="badge">Ưu đãi phòng gym</span>
        <h1 style={{ margin: 0 }}>{offer.title}</h1>
        <p style={{ color: "var(--muted)" }}>
          Hiệu lực từ {new Date(offer.valid_from).toLocaleDateString("vi-VN")} đến {new Date(offer.valid_to).toLocaleDateString("vi-VN")}.
        </p>
        <p>{offer.description ?? offer.summary ?? "Ưu đãi đã được kiểm duyệt và dành riêng cho hội viên mới."}</p>
        {offer.gym && (
          <Link href={`/gyms/${offer.gym.id}`} className="cta-button" style={{ width: "fit-content" }}>
            Đến trang phòng gym
          </Link>
        )}
      </section>

      <section>
        <header className="section-title">Ưu đãi khác</header>
        {related.length === 0 ? (
          <EmptyState
            title="Không có ưu đãi tương tự"
            description="Kiểm tra lại sau khi phòng gym đăng nhiều ưu đãi hơn."
          />
        ) : (
          <div className="card-grid">
            {related.map((item) => (
              <OfferCard key={item.id} offer={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
