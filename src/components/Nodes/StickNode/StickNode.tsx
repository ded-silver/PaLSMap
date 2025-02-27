import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import styles from './StickNode.module.css';
import { CustomNode, NodeData } from '../../../types/nodeTypes';
import { nanoid } from 'nanoid';
import { Typography } from '@mui/material';

export const StickNode = ({ data }: NodeProps<CustomNode>) => {
  return (
    <>
      <Typography sx={{ transform: 'translate(-50%, 0)' }}>{data.tableName[0]}</Typography>
      <div className={styles['stick']}>
        {data.handlers.map((h) => (
          <Handle
            key={nanoid()}
            type={h.type}
            id={h.id}
            position={h.type === 'source' ? Position.Right : Position.Left}
            style={{
              position: 'static',
            }}
          />
        ))}
      </div>
    </>
  );
};
