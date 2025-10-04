import FilterBar from "../components/FilterBar";
import GymCard from "../components/GymCard";
import MapPeek from "../components/MapPeek";
import EmptyState from "../components/EmptyState";
import { api } from "../lib/api";

export const revalidate = 0;

export default async function HomePage() {
  const gyms = await api.listGyms();

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem" }}>
      <section style={{ marginBottom: "2rem" }}>
        <div className="badge">Khám phá phòng gym hợp gu</div>
        <h1 className="page-title">Tìm gym phù hợp với lịch và ngân sách của bạn</h1>
        <p style={{ maxWidth: "620px", color: "#475569" }}>
          Lọc theo khoảng cách, tiện ích và đánh giá thực tế. Kết hợp với PT được xác thực bởi phòng gym để đạt kết quả nhanh hơn.
        </p>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 320px) 1fr", gap: "1.75rem" }}>
        <div className="sticky-pane">
          <FilterBar />
          <div style={{ marginTop: "1.5rem" }}>
            <MapPeek />
          </div>
        </div>

        <div>
          <header className="section-title">Phòng gym nổi bật gần bạn</header>
          {gyms.length === 0 ? (
            <EmptyState
              title="Chưa có phòng gym phù hợp"
              description="Thử mở rộng bán kính tìm kiếm hoặc thay đổi tiêu chí lọc."
            />
          ) : (
            <div className="card-grid">
              {gyms.map((gym) => (
                <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
