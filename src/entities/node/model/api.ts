import type {
	CustomNode,
	DuplicateNodeOptions,
	FlowPosition,
	NodeDto,
	PasteNodeOptions
} from './types'
import { COPY_PASTE_DEFAULTS } from './types'
import { axiosWithAuth } from '@/shared/api'

export const NodeService = {
	async getAll(pathAreaId?: string): Promise<CustomNode[]> {
		const response = await axiosWithAuth.get('/nodes', {
			params: pathAreaId ? { pathAreaId } : undefined
		})
		return response.data
	},

	async getByCountry(countryId: string): Promise<CustomNode[]> {
		const response = await axiosWithAuth.get(`/nodes/country/${countryId}`)
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
	},

	async duplicateNode(
		nodeId: string,
		options?: DuplicateNodeOptions
	): Promise<CustomNode> {
		const response = await axiosWithAuth.post(`/nodes/${nodeId}/duplicate`, {
			offsetX: options?.offsetX ?? COPY_PASTE_DEFAULTS.OFFSET_X,
			offsetY: options?.offsetY ?? COPY_PASTE_DEFAULTS.OFFSET_Y,
			copyChildren: options?.copyChildren ?? COPY_PASTE_DEFAULTS.COPY_CHILDREN,
			copyTableData:
				options?.copyTableData ?? COPY_PASTE_DEFAULTS.COPY_TABLE_DATA
		})
		return response.data
	},

	async duplicateNodes(
		nodeIds: string[],
		options?: DuplicateNodeOptions
	): Promise<CustomNode[]> {
		const response = await axiosWithAuth.post('/nodes/duplicate', {
			nodeIds,
			offsetX: options?.offsetX ?? COPY_PASTE_DEFAULTS.OFFSET_X,
			offsetY: options?.offsetY ?? COPY_PASTE_DEFAULTS.OFFSET_Y,
			copyChildren: options?.copyChildren ?? COPY_PASTE_DEFAULTS.COPY_CHILDREN,
			copyTableData:
				options?.copyTableData ?? COPY_PASTE_DEFAULTS.COPY_TABLE_DATA
		})
		return response.data
	},

	async pasteNodes(
		nodeIds: string[],
		position: FlowPosition,
		options?: PasteNodeOptions
	): Promise<CustomNode[]> {
		const response = await axiosWithAuth.post('/nodes/paste', {
			nodeIds,
			positionX: position.x,
			positionY: position.y,
			copyChildren: options?.copyChildren ?? COPY_PASTE_DEFAULTS.COPY_CHILDREN,
			copyTableData:
				options?.copyTableData ?? COPY_PASTE_DEFAULTS.COPY_TABLE_DATA
		})
		return response.data
	}
}
