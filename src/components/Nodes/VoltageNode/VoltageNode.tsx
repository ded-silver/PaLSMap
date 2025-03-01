import styles from './VoltageNode.module.css';

export const VoltageNode = () => {
  return (
    <div className={styles['voltage-node-container']}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="200"
        viewBox="0 0 100 200"
        className={styles['lightning-icon']}
      >
        <polyline points="80,20 30,70 80,60 30,123" fill="none" stroke="black" strokeWidth="3" />
        <polygon points="35,130 25,120 45,120" fill="black" />
      </svg>
    </div>
  );
};
