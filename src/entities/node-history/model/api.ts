import type {
	ActionType,
	EntityType,
	HistoryFiltersParams,
	HistoryResponse,
	NodeHistory
} from './types'
import { axiosWithAuth } from '@/shared/api'

class NodeHistoryApi {
	private BASE_URL = '/node-history'

	async getHistory(filters?: HistoryFiltersParams): Promise<HistoryResponse> {
		const params: Record<string, string> = {}

		if (filters?.entityType) {
			params.entityType = filters.entityType
		}
		if (filters?.actionType) {
			params.actionType = filters.actionType
		}
		if (filters?.userId) {
			params.userId = filters.userId
		}
		if (filters?.dateFrom) {
			params.dateFrom = filters.dateFrom
		}
		if (filters?.dateTo) {
			params.dateTo = filters.dateTo
		}
		if (filters?.nodeId) {
			params.nodeId = filters.nodeId
		}
		if (filters?.page !== undefined) {
			params.page = filters.page.toString()
		}
		if (filters?.limit !== undefined) {
			params.limit = filters.limit.toString()
		}

		const { data } = await axiosWithAuth.get<HistoryResponse>(this.BASE_URL, {
			params
		})
		return data
	}

	async getNodeHistory(nodeId: string): Promise<NodeHistory[]> {
		const { data } = await axiosWithAuth.get<NodeHistory[]>(
			`${this.BASE_URL}/node/${nodeId}`
		)
		return data
	}

	async getEntityHistory(
		entityType: EntityType,
		entityId: string
	): Promise<NodeHistory[]> {
		const { data } = await axiosWithAuth.get<NodeHistory[]>(
			`${this.BASE_URL}/entity/${entityType}/${entityId}`
		)
		return data
	}

	async getUserHistory(userId: string, limit?: number): Promise<NodeHistory[]> {
		const params: Record<string, string> = {}
		if (limit !== undefined) {
			params.limit = limit.toString()
		}

		const { data } = await axiosWithAuth.get<NodeHistory[]>(
			`${this.BASE_URL}/user/${userId}`,
			{
				params
			}
		)
		return data
	}
}

export const nodeHistoryApi = new NodeHistoryApi()
