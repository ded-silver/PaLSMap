import React, { useCallback, useRef, useState } from 'react';
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
  ReactFlowInstance,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DnDSidebar } from '../DnDSidebar';
import {
  OPSNode,
  SquareNode,
  StickNode,
  TableNode,
  TripleCirclesNode,
  VerticalCirclesNode,
  VoltageNode,
} from '../../Nodes';
import { DnDProvider, useDnD } from '../../../hooks/DnDContext';
import styles from './Main.module.css';

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: {
      label: '1',
      tableName: ['НПС Ухта'],
      tableData: [],
      handlers: [
        { id: '1', type: 'source' },
        { id: '1', type: 'target' },
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
        { id: '2', type: 'source' },
        { id: '2', type: 'target' },
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

const MMMain = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const [nodeName, setNodeName] = useState('Введите имя узла'); // Стейт для хранения имени узла

  // Обработчик изменения имени узла из сайдбара
  const onNodeNameChange = (name: string) => {
    setNodeName(name);
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) => {
        if (params.targetHandle) {
          const customEdge = {
            ...params,
            type: 'straight',
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

  // Обработчик для перетаскивания узлов
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Используем состояние для имени узла
      const newNode: Node = {
        id: `${+new Date()}`,
        type: 'OPS',
        position,
        data: {
          label: `${nodes.length + 1}`,
          tableName: [nodeName], // Применяем имя узла из состояния
          tableData: [],
          handlers: [
            {
              id: `${+new Date()}-source`,
              type: 'source',
            },
            {
              id: `${+new Date()}-target`,
              type: 'target',
            },
          ],
        },
      };

      setNodes((nds) => nds.concat(newNode));
      console.log('Добавлен узел:', newNode);
    },
    [screenToFlowPosition, nodes.length, setNodes, nodeName],
  );

  // Обработчик события перетаскивания
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className={styles['main-content']} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable
        fitView
      >
        <h1>Карта уставок защиты</h1>
        <Controls />
        <DnDSidebar onNodeNameChange={onNodeNameChange} /> {/* Передаем обработчик из Main */}
      </ReactFlow>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <MMMain />
    </DnDProvider>
  </ReactFlowProvider>
);
