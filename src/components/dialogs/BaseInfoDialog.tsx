import styles from "./Dialog.module.css";

interface Props {
  onClose: () => void;
}

export default function BaseInfoDialog({ onClose }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <p>Base information coming soon...</p>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
