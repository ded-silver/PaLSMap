export type EntityType = 'NODE' | 'EDGE' | 'TABLE_DATA'

export type ActionType =
	| 'CREATE'
	| 'UPDATE'
	| 'DELETE'
	| 'MOVE'
	| 'LOCK'
	| 'UNLOCK'
	| 'VISUAL_STATE_CHANGE'
	| 'PARENT_CHANGE'
	| 'HANDLERS_CHANGE'
	| 'LABEL_CHANGE'
	| 'TYPE_CHANGE'

export interface HistoryUser {
	id: string
	email: string
	name?: string
}

export interface HistoryChanges {
	before?: Record<string, any>
	after?: Record<string, any>
}

export interface NodeHistory {
	id: string
	createdAt: string
	userId: string
	user?: HistoryUser | null
	entityType: EntityType
	entityId: string
	actionType: ActionType
	changes: HistoryChanges
	description?: string
}

export interface HistoryFiltersParams {
	entityType?: EntityType
	actionType?: ActionType
	userId?: string
	dateFrom?: string
	dateTo?: string
	nodeId?: string
	page?: number
	limit?: number
}

export type HistoryFilters = HistoryFiltersParams

export interface HistoryResponse {
	data: NodeHistory[]
	total: number
	page: number
	limit: number
}
