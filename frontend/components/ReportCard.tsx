import Link from "next/link";
import styles from "./ReportCard.module.css";
import type { ReportItem } from "../types";

interface Props {
  report: ReportItem;
}

function ReportCard({ report }: Props) {
  const { offer, reporter, reason, status, created_at } = report;
  const detailHref = offer.offer_type === "GYM" ? `/offers/gyms/${offer.id}` : `/offers/pts/${offer.id}`;

  return (
    <article className={`card ${styles.wrapper}`}>
      <header className={styles.header}>
        <span className="badge">{offer.offer_type}</span>
        <span className={`${styles.status} ${styles[status]}`}>{status}</span>
      </header>
      <h3 className={styles.title}>{offer.title}</h3>
      <p className={styles.meta}>Báo cáo bởi {reporter.name} • {new Date(created_at).toLocaleString("vi-VN")}</p>
      <p className={styles.reason}>{reason}</p>
      <Link href={detailHref} className={styles.link}>
        Xem offer
      </Link>
    </article>
  );
}

export default ReportCard;
