import {
  Background,
  Connection,
  Controls,
  Edge,
  Handle,
  Node,
  NodeProps,
  Position,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import styles from './OPSNode.module.css';
import { nanoid } from 'nanoid';
import { CustomNode } from '../../../types/nodeTypes';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'НПС Ухта' },
    position: { x: 10, y: 10 },
    style: { width: 800, height: 800 },
    type: 'group',
  },
  {
    id: '1a',
    data: { label: 'МНС' },
    position: { x: 250, y: 100 },
    style: {
      backgroundColor: 'rgba(255, 0, 255, 0.2)',
      height: 150,
      width: 270,
    },
    parentId: '1',
  },
  {
    id: '1a1',
    data: { label: 'МНА 1' },
    position: { x: 20, y: 40 },
    style: { width: 50, height: 50 },
    parentId: '1a',
  },
  {
    id: '1a2',
    data: { label: 'МНА 2' },
    position: { x: 80, y: 40 },
    style: { width: 50, height: 50 },
    parentId: '1a',
  },
  {
    id: '1a3',
    data: { label: 'МНА 3' },
    position: { x: 140, y: 40 },
    style: { width: 50, height: 50 },
    parentId: '1a',
  },
  {
    id: '1a4',
    data: { label: 'МНА 4' },
    position: { x: 200, y: 40 },
    style: { width: 50, height: 50 },
    parentId: '1a',
  },
  {
    id: '1b',
    data: { label: 'САР' },
    position: { x: 600, y: 130 },
    style: { width: 100, height: 100 },
  },
  {
    id: '1c',
    data: { label: 'ФГУ' },
    position: { x: 140, y: 320 },
    style: { width: 100, height: 100 },
    parentId: '1',
    extent: 'parent',
  },
  {
    id: '1d',
    data: { label: 'ПНС' },
    position: { x: 300, y: 300 },
    style: {
      backgroundColor: 'rgba(255, 0, 255, 0.2)',
      height: 150,
      width: 270,
    },
    parentId: '1',
  },
  {
    id: '1d1',
    data: { label: 'ПНА' },
    position: { x: 20, y: 40 },
    style: { width: 50, height: 50 },
    parentId: '1d',
  },
  {
    id: '1e',
    data: { label: 'КППСОД' },
    position: { x: 300, y: 500 },
    style: { width: 270, height: 150 },
  },
];

const initialEdges = [
  { id: 'e1c-1e', source: '1c', target: '1e' },
  { id: 'e1d-1c', source: '1d', target: '1c' },
  { id: 'e1d-1d1', source: '1d', target: '1d1' },
  { id: 'e1d1-1d', source: '1d1', target: '1d1' },
  { id: 'e1a-1d', source: '1a', target: '1d1' },
  { id: 'e1a-1a1', source: '1a', target: '1a1' },
  { id: 'e1a1-1a2', source: '1a1', target: '1a2' },
  { id: 'e1a2-1a3', source: '1a2', target: '1a3' },
  { id: 'e1a3-1a4', source: '1a3', target: '1a4' },
  { id: 'e1a4-1a', source: '1a4', target: '1a' },
  { id: 'e1b-1a', source: '1b', target: '1a' },
];

export const OPSNode = ({ data }: NodeProps<CustomNode>) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) => {
        if (params.targetHandle) {
          const customEdge = {
            ...params,
            type: 'step',
            style: {
              strokeWidth: 2,
              stroke: 'black',
            },
          };
          console.log(customEdge);
          return addEdge(customEdge, eds);
        }
        return addEdge(params, eds);
      });
    },
    [setEdges],
  );
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Typography sx={{ transform: 'translate(10%, 0)' }}>{data.tableName[0]}</Typography>
      <div className={styles['circle-container']} onClick={handleClickOpen}>
        <div className={styles['circle']} />
        {data.handlers.map((h) => (
          <div key={nanoid()}>
            <Handle
              type={h.type}
              id={h.id}
              position={h.type === 'source' ? Position.Right : Position.Left}
            />
          </div>
        ))}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen
      >
        <DialogTitle>
          НПС
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              className="react-flow-subflows-example"
              fitView
              style={{ backgroundColor: '#F7F9FB' }}
              nodesDraggable={false}
            >
              <Controls />
              <Background color="#E6E6E6" />
            </ReactFlow>
          </ReactFlowProvider>
        </DialogContent>
      </Dialog>
    </>
  );
};
