import { useState } from 'react';
import styles from './Counter.module.scss';

export default function Counter(): JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.counter}>
      <button onClick={() => setCount(count + 1)}>Increase</button>
      <div>Button clicks: {count}</div>
    </div>
  );
}
