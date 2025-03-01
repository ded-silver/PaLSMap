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
  VoltageNode,
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
    position: { x: 200, y: 163 },
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
  {
    id: '7',
    position: { x: 400, y: 700 },
    data: {
      label: '7',
      tableName: ['з.4', 'ВЛ-166'],
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
          id: '12',
          type: 'source',
        },
        {
          id: '13',
          type: 'target',
        },
      ],
    },
    type: 'Table',
  },
  {
    id: '8',
    position: { x: 0, y: 0 },
    data: {
      label: '8',
      tableName: [],
      tableData: [],
      handlers: [
        {
          id: '14',
          type: 'source',
        },
        {
          id: '14',
          type: 'target',
        },
      ],
    },
    type: 'Voltage',
  },
  {
    id: '9',
    position: { x: 800, y: -200 },
    data: {
      label: '9',
      tableName: [],
      tableData: [],
      handlers: [
        {
          id: '15',
          type: 'source',
        },
        {
          id: '16',
          type: 'target',
        },
      ],
    },
    type: 'Voltage',
  },
  {
    id: '10',
    position: { x: 800, y: 700 },
    data: {
      label: '10',
      tableName: ['Т1', 'Выльгорт'],
      tableData: [
        {
          par1: 'МТЗ',
          par2: '180',
          par3: '2.5',
        },
      ],
      handlers: [
        {
          id: '17',
          type: 'source',
        },
        {
          id: '18',
          type: 'target',
        },
      ],
    },
    type: 'Table',
  },
  {
    id: '11',
    position: { x: 800, y: 900 },
    data: {
      label: '',
      tableName: [],
      tableData: [],
      handlers: [
        {
          id: '19',
          type: 'source',
        },
        {
          id: '20',
          type: 'target',
        },
      ],
    },
    type: 'VerticalCircles',
  },
  {
    id: '12',
    position: { x: 850, y: 1050 },
    data: {
      label: '12',
      tableName: [],
      tableData: [],
      handlers: [
        {
          id: '21',
          type: 'source',
        },
        {
          id: '22',
          type: 'target',
        },
      ],
    },
    type: 'Voltage',
  },
];

const initialEdges = [
  {
    type: 'step',
    source: '1',
    target: '2',
    id: '1',
    style: {
      strokeWidth: 1,
      stroke: 'black',
    },
  },
  {
    type: 'step',
    source: '2',
    target: '4',
    id: '2',
    style: {
      strokeWidth: 1,
      stroke: 'black',
    },
  },
  {
    type: 'step',
    source: '4',
    target: '5',
    id: '3',
    style: {
      strokeWidth: 1,
      stroke: 'black',
    },
  },
  {
    type: 'step',
    source: '5',
    target: '6',
    id: '4',
    style: {
      strokeWidth: 1,
      stroke: 'black',
    },
  },
  {
    type: 'step',
    source: '2',
    target: '4',
    id: '5',
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
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onConnect={onConnect}>
        <Controls />
      </ReactFlow>
    </div>
  );
};
