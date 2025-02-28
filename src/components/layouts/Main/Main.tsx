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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  HorizontalCirclesNode,
  SquareNode,
  StickNode,
  TableNode,
  TripleCirclesNode,
  VerticalCirclesNode,
} from '../../Nodes';
import { useCallback } from 'react';

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: {
      tableName: ['ПС Сыктывкар'],
      tableData: [],
      handlers: [
        {
          id: '1',
          type: 'source',
        },
        {
          id: '2',
          type: 'source',
        },
        {
          id: '3',
          type: 'source',
        },
      ],
    },
    type: 'Stick',
  },
  {
    id: '2',
    position: { x: 200, y: 150 },
    data: {
      label: '2',
      tableName: [],
      tableData: [],
      handlers: [
        {
          id: '2',
          type: 'source',
        },
        {
          id: '3',
          type: 'target',
        },
      ],
    },
    type: 'Square',
  },
  {
    id: '3',
    position: { x: 200, y: 700 },
    data: {
      label: '3',
      tableName: [],
      tableData: [],
      handlers: [
        {
          id: '4',
          type: 'source',
        },
        {
          id: '5',
          type: 'target',
        },
      ],
    },
    type: 'Square',
  },
  {
    id: '4',
    position: { x: 400, y: 100 },
    data: {
      label: '4',
      tableName: ['з.1', 'ВЛ-181'],
      tableData: [
        {
          par1: 'Z1',
          par2: '10',
          par3: '0',
        },
        {
          par1: 'Z2',
          par2: '22',
          par3: '0.9',
        },
        {
          par1: 'Z3',
          par2: '260',
          par3: '4.2',
        },
        {
          par1: 'То1',
          par2: '2500',
          par3: '0',
        },
        {
          par1: 'То2',
          par2: '900',
          par3: '0.8',
        },
        {
          par1: 'То3',
          par2: '530',
          par3: '1.2',
        },
        {
          par1: 'Т0',
          par2: '4650',
          par3: '0',
        },
      ],
      handlers: [
        {
          id: '6',
          type: 'source',
        },
        {
          id: '7',
          type: 'target',
        },
      ],
    },
    type: 'Table',
  },
  {
    id: '5',
    position: { x: 800, y: 150 },
    data: {
      label: '5',
      tableName: ['Т1', 'Западная'],
      tableData: [
        {
          par1: 'МТЗ',
          par2: '400',
          par3: '2.4',
        },
      ],
      handlers: [
        {
          id: '8',
          type: 'source',
        },
        {
          id: '9',
          type: 'target',
        },
      ],
    },
    type: 'Table',
  },
  {
    id: '6',
    position: { x: 800, y: -100 },
    data: {
      label: '',
      tableName: [],
      tableData: [],
      handlers: [
        {
          id: '10',
          type: 'source',
        },
        {
          id: '11',
          type: 'target',
        },
      ],
    },
    type: 'TripleCircles',
  },
];

const initialEdges = [
  // {
  //   type: 'step',
  //   source: '1',
  //   target: '2',
  //   id: '1',
  //   style: {
  //     strokeWidth: 1,
  //     stroke: 'black',
  //   },
  // },
  // {
  //   type: 'step',
  //   source: '2',
  //   target: '3',
  //   id: '2',
  //   style: {
  //     strokeWidth: 1,
  //     stroke: 'black',
  //   },
  // },
  {
    type: 'step',
    source: '30',
    target: '40',
    id: '30',
    style: {
      strokeWidth: 1,
      stroke: 'black',
    },
  },
  {
    type: 'step',
    source: '40',
    target: '50',
    id: '40',
    style: {
      strokeWidth: 1,
      stroke: 'black',
    },
  },
];

const nodeTypes = {
  Table: TableNode,
  Square: SquareNode,
  Stick: StickNode,
  HorizontalCircles: HorizontalCirclesNode,
  VerticalCircles: VerticalCirclesNode,
  TripleCircles: TripleCirclesNode,
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
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onConnect={onConnect}>
        <Controls />
      </ReactFlow>
    </div>
  );
};
