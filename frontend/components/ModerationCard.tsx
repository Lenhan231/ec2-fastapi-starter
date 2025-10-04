import Link from "next/link";
import styles from "./ModerationCard.module.css";
import type { ModerationItem } from "../types";

interface Props {
  item: ModerationItem;
}

function ModerationCard({ item }: Props) {
  const { offer, risk_score, escalated, flagged_labels, submitted_by, submitted_at } = item;
  const detailHref = offer.offer_type === "GYM" ? `/offers/gyms/${offer.id}` : `/offers/pts/${offer.id}`;

  return (
    <article className={`card ${styles.wrapper}`}>
      <header className={styles.header}>
        <span className="badge">{offer.offer_type === "GYM" ? "Gym offer" : "PT offer"}</span>
        <span className={styles.score}>Risk: {(risk_score * 100).toFixed(0)}%</span>
      </header>
      <h3 className={styles.title}>{offer.title}</h3>
      <p className={styles.meta}>
        Bởi {submitted_by.name} • {new Date(submitted_at).toLocaleString("vi-VN")}
      </p>
      {flagged_labels.length > 0 && (
        <div className={styles.labels}>
          {flagged_labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}
      <div className={styles.footer}>
        <Link href={detailHref}>Xem chi tiết</Link>
        {escalated ? <span className={styles.escalated}>Escalated</span> : <span className={styles.auto}>Auto-approve candidate</span>}
      </div>
    </article>
  );
}

export default ModerationCard;
