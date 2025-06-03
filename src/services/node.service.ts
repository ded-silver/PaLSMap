import { axiosWithAuth } from '../api/interceptiors'
import { CustomNode } from '../types/nodeTypes'

export interface NodeDto {
	id: string
	type:
		| 'OPS'
		| 'TankPark'
		| 'Factory'
		| 'Object'
		| 'ParentObject'
		| 'ChildObject'
	position: { x: number; y: number }
	data: {
		tableName: string[]
		label: string
		tableData: { [key: string]: string }[]
		handlers: {
			id: string
			type: 'target' | 'source'
		}[]
	}
	parentId?: string
}

export const NodeService = {
	async getAll(): Promise<CustomNode[]> {
		const response = await axiosWithAuth.get('/nodes')
		return response.data
	},

	async getById(id: string): Promise<CustomNode> {
		const response = await axiosWithAuth.get(`/nodes/${id}`)
		return response.data
	},

	async getChildren(parentId: string): Promise<CustomNode[]> {
		const response = await axiosWithAuth.get(`/nodes/children/${parentId}`)
		return response.data
	},

	async getRootNodes(): Promise<CustomNode[]> {
		const response = await axiosWithAuth.get(`/nodes/root`)
		return response.data
	},

	async create(node: NodeDto): Promise<CustomNode> {
		const response = await axiosWithAuth.post('/nodes', node)
		return response.data
	},

	async update(id: string, node: Partial<NodeDto>): Promise<CustomNode> {
		const response = await axiosWithAuth.patch(`/nodes/${id}`, node)
		return response.data
	},

	async delete(id: string): Promise<void> {
		await axiosWithAuth.delete(`/nodes/${id}`)
	}
}
