import styles from "./Dialog.module.css";

interface Props {
  onClose: () => void;
}

export default function ProjectsDialog({ onClose }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2>Projects</h2>
        <p>
          I&apos;ve tackled a range of web and full-stack builds, from personal
          experiments to client-focused apps. I also bring technical know-how to
          multimedia film projects through Otiosum - Filmproduktion OG.
        </p>
        <p>
          Recent highlights include this Space Invaders portfolio and several
          small tools that sharpen my development skills.
        </p>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
