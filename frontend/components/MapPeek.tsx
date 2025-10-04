import styles from "./MapPeek.module.css";

function MapPeek() {
  return (
    <div className={`card ${styles.wrapper}`}>
      <h3>Map Peek</h3>
      <p>Hiển thị vị trí của các phòng gym gần bạn.</p>
      <div className={styles.mapMock}>
        <div className={styles.pin} style={{ top: "35%", left: "30%" }} />
        <div className={styles.pin} style={{ top: "55%", left: "60%" }} />
        <div className={styles.pin} style={{ top: "25%", left: "70%" }} />
      </div>
    </div>
  );
}

export default MapPeek;
