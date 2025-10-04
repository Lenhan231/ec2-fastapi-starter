import Link from "next/link";
import styles from "./EmptyState.module.css";

interface Props {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

function EmptyState({ title, description, actionLabel, actionHref }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon} aria-hidden>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9Z"
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          <path d="M8 9h8" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 13h4" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className={styles.action}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
