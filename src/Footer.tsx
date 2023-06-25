import styles from './Footer.module.scss';

export default function Footer(): JSX.Element {
  return (
    <div className={styles.footer}>
      App name <span className={styles.date}>{new Date().getFullYear()}</span>
    </div>
  );
}
