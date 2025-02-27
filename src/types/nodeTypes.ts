import { Node } from '@xyflow/react';

export interface NodeData {
  [key: string]: string;
}

export interface NodeHeandlers {
  id: string;
  type: 'target' | 'source';
}

export interface CustomNode extends Node {
  data: {
    label: string;
    tableName: string[];
    tableData: NodeData[];
    handlers: NodeHeandlers[];
  };
}
