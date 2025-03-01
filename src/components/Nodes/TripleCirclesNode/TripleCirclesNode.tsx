import { Handle, NodeProps, Position } from '@xyflow/react';
import styles from './TripleCirclesNode.module.css';
import { nanoid } from 'nanoid';
import { CustomNode, NodeHeandlers } from '../../../types/nodeTypes';

export const TripleCirclesNode = ({ data }: NodeProps<CustomNode>) => {
  return (
    <div className={styles['triplecircles-circles-container']}>
      <div className={styles['top-row']}>
        {data.handlers.slice(0, 2).map((h: NodeHeandlers) => (
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
      <div className={styles['bottom-circle-wrapper']}>
        <div className={styles['circle-wrapper']}>
          <div className={styles['circle']} />
        </div>
      </div>
    </div>
  );
};
