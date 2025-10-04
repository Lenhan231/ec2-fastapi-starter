import EmptyState from "../../../components/EmptyState";
import PTCard from "../../../components/PTCard";
import OfferCard from "../../../components/OfferCard";
import { api } from "../../../lib/api";

interface PageProps {
  params: { ptId: string };
}

export default async function PTDetailPage({ params }: PageProps) {
  const id = Number(params.ptId);
  const profile = await api.getPTProfile(id);
  const offers = (await api.listPTOffers()).filter((offer) => offer.pt?.id === id);

  if (!profile) {
    return (
      <EmptyState
        title="Không tìm thấy PT"
        description="Huấn luyện viên có thể đã gỡ profile."
        actionLabel="Quay lại ưu đãi PT"
        actionHref="/offers/pts"
      />
    );
  }

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem", display: "grid", gap: "1.5rem" }}>
      <section className="card">
        <PTCard profile={profile} />
      </section>

      <section>
        <header className="section-title">Ưu đãi của PT</header>
        {offers.length === 0 ? (
          <EmptyState
            title="Chưa có ưu đãi"
            description="PT sẽ cập nhật ưu đãi mới trong thời gian tới."
          />
        ) : (
          <div className="card-grid">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
