import styles from './Main.module.css';
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Connection,
  Edge,
  addEdge,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  OPSNode,
  SquareNode,
  StickNode,
  TableNode,
  TripleCirclesNode,
  VerticalCirclesNode,
  VoltageNode,
} from '../../Nodes';
import { useCallback } from 'react';

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: {
      label: '1',
      tableName: ['НПС Ухта'],
      tableData: [],
      handlers: [
        {
          id: '1',
          type: 'source',
        },
        {
          id: '1',
          type: 'target',
        },
      ],
    },
    type: 'OPS',
  },
  {
    id: '2',
    position: { x: 400, y: -150 },
    data: {
      label: '2',
      tableName: ['НПС Уса'],
      tableData: [],
      handlers: [
        {
          id: '2',
          type: 'source',
        },
        {
          id: '2',
          type: 'target',
        },
      ],
    },
    type: 'OPS',
  },
];

const initialEdges = [
  {
    type: 'straight',
    source: '1',
    target: '2',
    id: '1',
    style: {
      strokeWidth: 2,
      stroke: 'black',
    },
  },
];

const nodeTypes = {
  Table: TableNode,
  Square: SquareNode,
  Stick: StickNode,
  OPS: OPSNode,
  VerticalCircles: VerticalCirclesNode,
  TripleCircles: TripleCirclesNode,
  Voltage: VoltageNode,
};

export const Main = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
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

  return (
    <div className={styles['main-content']}>
      <h1>Карта уставок защиты</h1>
      <ReactFlowProvider>
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onConnect={onConnect} fitView>
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};
