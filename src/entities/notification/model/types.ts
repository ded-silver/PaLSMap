export interface INotification {
	id: string
	userId: string
	type: 'info' | 'success' | 'warning' | 'error' | 'permission_request'
	title: string
	message: string
	read: boolean
	readAt?: string
	relatedEntityType?: string
	relatedEntityId?: string
	createdAt: string
}

export interface INotificationResponse {
	items: INotification[]
	total: number
}

export interface INotificationApiResponse {
	data: INotification[]
	meta: {
		total: number
		limit: number
		offset: number
		hasMore: boolean
	}
}

export interface INotificationFilters {
	read?: boolean
	type?: INotification['type']
	page?: number
	limit?: number
}

export interface IUnreadCountResponse {
	count: number
}
