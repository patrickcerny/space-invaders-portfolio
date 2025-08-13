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
          I&apos;ve built everything from small full-stack apps to interactive
          experiments like this game. Freelance work and my role at Otiosum –
          Filmproduktion OG have given me experience across web, tooling and
          multimedia film projects. More demos and links will arrive here soon!
        </p>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
