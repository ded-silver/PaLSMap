export interface NodeData {
	id: string
	protectionName: string
	excerpt: string
	source: string
	triggeringConditions: string
	triggeringAlgorithm: string
	order: number
}

export interface NodeDataPayload {
	data: NodeData
	id: string
}
