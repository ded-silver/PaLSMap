import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import styles from './SquareNode.module.css';
import { CustomNode, NodeData } from '../../../types/nodeTypes';
import { nanoid } from 'nanoid';


export const SquareNode = ({ data }: NodeProps<CustomNode>) => {
  return (
    <div className={styles['square']}>
      {data.handlers.map((h) => (
        <Handle
          key={nanoid()}
          type={h.type}
          id={h.id}
          position={h.type === 'source' ? Position.Right : Position.Left}
        />
      ))}
    </div>
  );
};
