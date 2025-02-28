import { Handle, NodeProps, Position } from '@xyflow/react';
import styles from './TripleCirclesNode.module.css';
import { nanoid } from 'nanoid';
import { CustomNode } from '../../../types/nodeTypes';

export const TripleCirclesNode = ({ data }: NodeProps<CustomNode>) => {
  return (
    <div className={styles['triplecircles-circles-container']}>
      {data.handlers.map((h) => (
        <div className={styles['circle-wrapper']} key={nanoid()}>
          <div className={styles['circle']} />
          <Handle
            type={h.type}
            id={h.id}
            position={h.type === 'source' ? Position.Right : Position.Left}
          />
        </div>
      ))}
    </div>
  );
};
