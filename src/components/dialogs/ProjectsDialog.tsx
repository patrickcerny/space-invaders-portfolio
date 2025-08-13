import styles from "./Dialog.module.css";

interface Props {
  onClose: () => void;
}

export default function ProjectsDialog({ onClose }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2>Projects</h2>
        <ul>
          <li>
            Built web and full-stack apps for personal experiments and clients.
          </li>
          <li>
            Contributed technical know-how to multimedia film projects through
            Otiosum - Filmproduktion OG.
          </li>
          <li>
            Created this Space Invaders portfolio and several small tools to
            sharpen my development skills.
          </li>
        </ul>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
