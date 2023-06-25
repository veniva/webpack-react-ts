import styles from './MainContent.module.scss';
import Counter from './Counter';

export default function MainContent(): JSX.Element {
  return (
    <section className={styles['main-content']}>
      <Counter />
    </section>
  );
}
