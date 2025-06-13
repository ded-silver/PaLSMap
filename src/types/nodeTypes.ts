import { Node } from '@xyflow/react'

export interface NodeDto {
	id: string
	type:
		| 'OPS'
		| 'TankPark'
		| 'Checkpoint'
		| 'Valve'
		| 'Pump'
		| 'AccountingSystem'
		| 'ChildTankPark'
		| 'PNS'
		| 'MNS'
		| 'SAR'
		| 'FGU'
		| 'KPPSOD'
		| 'Capacity'
		| 'River'
		| 'Factory'
		| 'Object'
		| 'ParentObject'
		| 'ChildObject'
	position: { x: number; y: number }
	data: CustomData
	measured?:
		| {
				width?: number | undefined
				height?: number | undefined
		  }
		| undefined
	parentId?: string
}

export interface NodeData {
	id: string
	protectionName: string
	excerpt: string
	source: string
	triggeringConditions: string
	triggeringAlgorithm: string
	order: number
}

export interface NodeHandlers {
	id: string
	type: 'target' | 'source'
}

export interface NodeDataPayload {
	data: NodeData
	id: string
}

export interface CustomData {
	measured: { width: number; height: number }
	label: string
	tableData: NodeData[]
	handlers: NodeHandlers[]
	[key: string]: unknown
}

export interface CustomNode extends Node {
	data: CustomData
}
