// DnDSidebar.tsx
import React, { useState } from 'react';
import { useDnD } from '../../../hooks/DnDContext';
import styles from './DnDSidebar.module.css';

export const DnDSidebar = ({ onNodeNameChange }: { onNodeNameChange: (name: string) => void }) => {
  const { setType } = useDnD();
  const [nodeName, setNodeName] = useState('');

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType);
    const { dataTransfer } = event;
    dataTransfer.effectAllowed = 'move';
    console.log(nodeType);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(event.target.value);
    onNodeNameChange(event.target.value); // передаем новое имя в родительский компонент
  };

  return (
    <aside className={styles.sidebar}>
      <div>
        <label>Имя узла:</label>
        <input
          type="text"
          value={nodeName}
          onChange={handleNameChange}
          placeholder="Введите имя узла"
        />
      </div>
      <div>
        <span className={styles.title}>Добавить узел:</span>
        <div className={styles.dndnode} onDragStart={(e) => onDragStart(e, 'OPS')} draggable>
          OPS
        </div>
      </div>
    </aside>
  );
};
