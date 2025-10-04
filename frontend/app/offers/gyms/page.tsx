import OfferCard from "../../../components/OfferCard";
import OfferFilterBar from "../../../components/OfferFilterBar";
import EmptyState from "../../../components/EmptyState";
import { api } from "../../../lib/api";

export const revalidate = 0;

export default async function GymOffersPage({ searchParams }: { searchParams?: { gym_id?: string } }) {
  const offers = await api.listGymOffers({ gym_id: searchParams?.gym_id });

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <div className="badge">Deal phòng gym</div>
        <h1 className="page-title">Ưu đãi phòng gym được kiểm duyệt</h1>
        <p style={{ color: "#475569", maxWidth: "640px" }}>
          Ưu tiên hiển thị cho các phòng gym nâng cấp subscription. Tất cả ưu đãi đều đi qua pipeline moderation tự động và thủ công.
        </p>
      </header>

      <OfferFilterBar variant="gym" />

      {offers.length === 0 ? (
        <EmptyState
          title="Chưa có ưu đãi phù hợp"
          description="Khi phòng gym đăng ưu đãi và được phê duyệt, bạn sẽ thấy tại đây."
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
