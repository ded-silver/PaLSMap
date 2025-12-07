export interface IPermissionRequest {
	id: string
	userId: string
	user: {
		id: string
		email: string
		name: string
	}
	requestedRole: 'admin' | 'superAdmin'
	status: 'pending' | 'approved' | 'rejected'
	reason?: string
	reviewedBy?: {
		id: string
		email: string
		name: string
	}
	reviewedAt?: string
	createdAt: string
}

export interface IPermissionRequestResponse {
	items: IPermissionRequest[]
	total: number
}

export interface IPermissionRequestApiResponse {
	data: IPermissionRequest[]
	meta: {
		total: number
		limit: number
		offset: number
		hasMore: boolean
	}
}

export interface ICreatePermissionRequestDto {
	requestedRole: 'admin' | 'superAdmin'
	reason?: string
}

export interface IApproveRequestDto {
	reason?: string
}

export interface IRejectRequestDto {
	reason?: string
}

export interface IPermissionRequestFilters {
	status?: IPermissionRequest['status']
	requestedRole?: IPermissionRequest['requestedRole']
	page?: number
	limit?: number
}
