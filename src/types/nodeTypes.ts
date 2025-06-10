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
	data: {
		label: string
		tableData: NodeData[]
		handlers: {
			id: string
			type: 'target' | 'source'
		}[]
	}
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

export interface NodeHeandlers {
	id: string
	type: 'target' | 'source'
}

export interface NodeDataPayload {
	data: NodeData
	id: string
}

export interface CustomNode extends Node {
	data: {
		label: string
		tableName: string[]
		tableData: NodeData[]
		handlers: NodeHeandlers[]
	}
}
