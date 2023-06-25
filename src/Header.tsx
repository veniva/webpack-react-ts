import styles from './Header.module.scss';
import logo from './assets/logo-react.svg';

export default function Header() {
  return (
    <section className={styles.header}>
      <img src={logo} />
      <h1>ReactJS Project</h1>
    </section>
  );
}
