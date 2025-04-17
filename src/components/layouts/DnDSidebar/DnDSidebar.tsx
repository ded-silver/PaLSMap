import React from 'react';
import { useDnD } from '../../../hooks/DnDContext';
import styles from './DnDSidebar.module.css';

export const DnDSidebar = () => {
  const { setType } = useDnD();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType);
    const { dataTransfer } = event;
    dataTransfer.effectAllowed = 'move';
    console.log(nodeType);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.title}>Добавить узел:</div>
      <div className={styles.dndnode} onDragStart={(e) => onDragStart(e, 'OPS')} draggable>
        OPS
      </div>
    </aside>
  );
};
