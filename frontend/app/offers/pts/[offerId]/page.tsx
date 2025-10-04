import Link from "next/link";

import OfferCard from "../../../../components/OfferCard";
import PTCard from "../../../../components/PTCard";
import EmptyState from "../../../../components/EmptyState";
import { api } from "../../../../lib/api";

interface PageProps {
  params: { offerId: string };
}

export default async function PTOfferDetailPage({ params }: PageProps) {
  const id = Number(params.offerId);
  const offer = await api.getPTOffer(id);
  const ptProfile = offer?.pt ? await api.getPTProfile(offer.pt.id) : null;
  const related = (await api.listPTOffers()).filter((item) => item.id !== offer.id).slice(0, 3);

  if (!offer) {
    return (
      <EmptyState
        title="Không tìm thấy ưu đãi"
        description="Ưu đãi có thể đã bị gỡ hoặc hết hạn."
        actionLabel="Quay lại danh sách"
        actionHref="/offers/pts"
      />
    );
  }

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem", display: "grid", gap: "1.5rem" }}>
      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <span className="badge">Ưu đãi huấn luyện viên</span>
        <h1 style={{ margin: 0 }}>{offer.title}</h1>
        <p style={{ color: "var(--muted)" }}>
          Hiệu lực đến {new Date(offer.valid_to).toLocaleDateString("vi-VN")} • Trạng thái {offer.status ?? "pending"}
        </p>
        <p>{offer.description ?? offer.summary ?? "Ưu đãi được kiểm duyệt và chỉ dành cho học viên đăng ký sớm."}</p>
        {ptProfile && (
          <div>
            <h2 className="section-title">Huấn luyện viên</h2>
            <PTCard profile={ptProfile} />
          </div>
        )}
        {offer.gym && (
          <Link href={`/gyms/${offer.gym.id}`} className="cta-button" style={{ width: "fit-content" }}>
            Xem phòng gym liên kết
          </Link>
        )}
      </section>

      <section>
        <header className="section-title">Ưu đãi tương tự</header>
        {related.length === 0 ? (
          <EmptyState
            title="Không có ưu đãi tương tự"
            description="Hãy quay lại sau để xem thêm ưu đãi mới."
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
