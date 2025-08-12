import styles from "./Dialog.module.css";

interface Props {
  onClose: () => void;
}

export default function ProjectsDialog({ onClose }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <p>Projects coming soon...</p>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
