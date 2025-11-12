import type { NodeData, NodeDataPayload } from './types'
import { axiosWithAuth } from '@/shared/api'

export const NodeDataService = {
	async getNodeData(id: string): Promise<NodeData[]> {
		const response = await axiosWithAuth.get(`/nodes/data/${id}`)
		return response.data
	},

	async createNodeData(payload: NodeDataPayload): Promise<NodeData> {
		const response = await axiosWithAuth.post(
			`/nodes/data/${payload.id}`,
			payload.data
		)
		return response.data
	},

	async updateNodeData(payload: NodeData): Promise<void> {
		await axiosWithAuth.patch(`/nodes/data/${payload.id}`, payload)
	},

	async deleteNodeData(id: string): Promise<void> {
		await axiosWithAuth.delete(`/nodes/data/${id}`)
	}
}
