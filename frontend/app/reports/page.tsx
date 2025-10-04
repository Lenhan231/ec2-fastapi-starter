import ReportCard from "../../components/ReportCard";
import EmptyState from "../../components/EmptyState";
import { api } from "../../lib/api";

export const revalidate = 0;

export default async function ReportsPage() {
  const reports = await api.getReports();

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem", display: "grid", gap: "1.5rem" }}>
      <header>
        <div className="badge">Reports</div>
        <h1 className="page-title">Báo cáo từ người dùng</h1>
        <p style={{ color: "#475569", maxWidth: "680px" }}>
          Khi client báo cáo offer hoặc PT, trạng thái và lý do sẽ hiển thị tại đây để Gym Staff hoặc Admin xử lý và re-review.
        </p>
      </header>

      {reports.length === 0 ? (
        <EmptyState
          title="Không có báo cáo"
          description="Các báo cáo mới sẽ hiển thị tại đây cùng trạng thái xử lý."
        />
      ) : (
        <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
