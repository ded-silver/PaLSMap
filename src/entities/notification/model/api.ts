import type {
	INotification,
	INotificationApiResponse,
	INotificationFilters,
	INotificationResponse,
	IUnreadCountResponse
} from './types'
import { axiosWithAuth } from '@/shared/api'

export const notificationApi = {
	async getAll(filters?: INotificationFilters): Promise<INotificationResponse> {
		const params: Record<string, any> = {}

		if (filters?.read !== undefined) {
			params.read = filters.read
		}
		if (filters?.type) {
			params.type = filters.type
		}
		if (filters?.limit) {
			params.limit = filters.limit
		}
		if (filters?.page && filters?.limit) {
			params.offset = (filters.page - 1) * filters.limit
		}

		const { data } = await axiosWithAuth.get<INotificationApiResponse>(
			'/notifications',
			{
				params
			}
		)
		return {
			items: data.data || [],
			total: data.meta?.total || 0
		}
	},

	async getUnreadCount(): Promise<IUnreadCountResponse> {
		const { data } = await axiosWithAuth.get<IUnreadCountResponse>(
			'/notifications/unread-count'
		)
		return data
	},

	async markAsRead(id: string): Promise<INotification> {
		const { data } = await axiosWithAuth.patch<INotification>(
			`/notifications/${id}/read`
		)
		return data
	},

	async markAllAsRead(): Promise<{ count: number }> {
		const { data } = await axiosWithAuth.patch<{ count: number }>(
			'/notifications/read-all'
		)
		return data
	},

	async deleteNotification(id: string): Promise<void> {
		await axiosWithAuth.delete(`/notifications/${id}`)
	}
}
