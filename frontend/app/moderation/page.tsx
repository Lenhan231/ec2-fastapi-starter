import ModerationCard from "../../components/ModerationCard";
import EmptyState from "../../components/EmptyState";
import { api } from "../../lib/api";

export const revalidate = 0;

export default async function ModerationPage() {
  const queue = await api.getModerationQueue();

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem", display: "grid", gap: "1.5rem" }}>
      <header>
        <div className="badge">Admin moderation</div>
        <h1 className="page-title">Moderation queue</h1>
        <p style={{ color: "#475569", maxWidth: "680px" }}>
          Các offer bị hệ thống đánh dấu sẽ hiển thị tại đây cùng điểm risk, labels từ SageMaker và thông tin người tạo. Admin có thể ưu tiên theo risk để duyệt nhanh.
        </p>
      </header>

      {queue.length === 0 ? (
        <EmptyState
          title="Queue trống"
          description="Khi có offer bị flag hoặc escalated, chúng sẽ xuất hiện ở đây."
        />
      ) : (
        <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {queue.map((item) => (
            <ModerationCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
