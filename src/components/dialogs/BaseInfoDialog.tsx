import styles from "./Dialog.module.css";

interface Props {
  onClose: () => void;
}

export default function BaseInfoDialog({ onClose }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2>About Me</h2>
        <p>
          I&apos;m a self-taught developer who turned a programming hobby into a
          profession. After studying Digital Business at HAK Bregenz and
          tackling countless tutorials, internships and projects, I went
          freelance and co-founded Otiosum – Filmproduktion OG where I work as a
          1st AC. I&apos;m now studying Technical Mathematics at TU and always
          exploring new web and full-stack ideas. Curious about our film work?
          Visit{" "}
          <a
            href="https://otiosum-austria.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            otiosum-austria.com
          </a>
          .
        </p>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
