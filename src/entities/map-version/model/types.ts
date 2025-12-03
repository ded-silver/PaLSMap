export type NodeType =
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

export interface MapVersionSnapshot {
	nodes: Array<{
		id: string
		type: NodeType
		position: { x: number; y: number }
		measured?: { width: number; height: number }
		parentId?: string
		data: {
			id: string
			label: string
			handlers: Array<{
				id: string
				type: 'target' | 'source'
			}>
			locked: boolean
			visualState?: {
				status?: 'normal' | 'warning' | 'error' | 'info'
				borderColor?: string
				borderWidth?: number
				backgroundColor?: string
				opacity?: number
			}
		}
	}>
	edges: Array<{
		id: string
		source: string
		target: string
		sourceHandle: string
		targetHandle: string
		type: string
		style?: {
			strokeWidth?: number
			stroke?: string
			[key: string]: unknown
		}
	}>
	tableData: Array<{
		nodeDataId: string
		protectionName: string
		excerpt: string
		source: string
		triggeringAlgorithm: string
		triggeringConditions: string
		order: number
	}>
}

export interface MapVersionCreatedBy {
	id: string
	email: string
	name?: string
}

export interface MapVersion {
	id: string
	pathAreaId: string
	name: string
	description?: string
	createdAt: string
	createdBy: MapVersionCreatedBy
	snapshot: MapVersionSnapshot
	nodeCount?: number
}

export interface CreateMapVersionDto {
	name: string
	description?: string
	pathAreaId: string
}

export interface RestoreVersionResponse {
	success: boolean
	message: string
}

export interface DeleteVersionResponse {
	success: boolean
}
