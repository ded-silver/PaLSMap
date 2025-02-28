import { Handle, NodeProps, Position } from '@xyflow/react';
import styles from './VerticalCirclesNode.module.css';
import { nanoid } from 'nanoid';
import { CustomNode } from '../../../types/nodeTypes';

export const VerticalCirclesNode = ({ data }: NodeProps<CustomNode>) => {
  return (
    <div className={styles['vertical-circles-container']}>
      {data.handlers.map((h) => (
        <div className={styles['circle-wrapper']} key={nanoid()}>
          <div className={styles['circle']} />
          <Handle
            type={h.type}
            id={h.id}
            position={h.type === 'source' ? Position.Top : Position.Bottom}
          />
        </div>
      ))}
    </div>
  );
};
