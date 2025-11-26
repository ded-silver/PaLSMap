import { Node } from '@xyflow/react'

import type { NodeData } from '@/entities/node-data'

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
	locked?: boolean
	visualState?: VisualState
}

export interface NodeHandlers {
	id: string
	type: 'target' | 'source'
}

export interface VisualState {
	status?: 'normal' | 'warning' | 'error' | 'info'
	borderColor?: string
	borderWidth?: number
	backgroundColor?: string
	opacity?: number
}

export interface CustomData {
	measured: { width: number; height: number }
	label: string
	tableData: NodeData[]
	handlers: NodeHandlers[]
	locked?: boolean
	visualState?: VisualState
	[key: string]: unknown
}

export interface CustomNode extends Node {
	data: CustomData
	locked?: boolean
}
