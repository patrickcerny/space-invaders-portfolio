import styles from "./Dialog.module.css";

interface Props {
  onClose: () => void;
}

export default function BaseInfoDialog({ onClose }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2>About</h2>
        <p>
          Programming went from hobby to profession. Tutorials and the HAK
          Bregenz Digital Business program gave me a foundation in web and
          full-stack development.
        </p>
        <p>
          I&apos;m the First Assistant Camera and co-founder of Otiosum -
          Filmproduktion OG and currently study Technical Mathematics at TU.
        </p>
        <p>
          Learn more at{' '}
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
