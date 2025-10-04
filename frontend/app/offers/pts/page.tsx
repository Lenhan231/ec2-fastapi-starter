import OfferCard from "../../../components/OfferCard";
import OfferFilterBar from "../../../components/OfferFilterBar";
import EmptyState from "../../../components/EmptyState";
import { api } from "../../../lib/api";

export const revalidate = 0;

export default async function PTOffersPage() {
  const offers = await api.listPTOffers();

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <div className="badge">Deal huấn luyện viên</div>
        <h1 className="page-title">Ưu đãi PT được gym xác thực</h1>
        <p style={{ color: "#475569", maxWidth: "640px" }}>
          Tìm PT theo lịch rảnh, phòng gym cộng tác và ngân sách. Các ưu đãi phải được Gym Staff duyệt trước khi tới bạn.
        </p>
      </header>

      <OfferFilterBar variant="pt" />

      {offers.length === 0 ? (
        <EmptyState
          title="Chưa có ưu đãi"
          description="PT sẽ hiển thị ở đây sau khi submit và được duyệt."
        />
      ) : (
        <div className="card-grid">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}
