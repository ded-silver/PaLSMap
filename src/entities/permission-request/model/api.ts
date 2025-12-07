import type {
	IApproveRequestDto,
	ICreatePermissionRequestDto,
	IPermissionRequest,
	IPermissionRequestApiResponse,
	IPermissionRequestFilters,
	IPermissionRequestResponse,
	IRejectRequestDto
} from './types'
import { axiosWithAuth } from '@/shared/api'

export const permissionRequestApi = {
	async getAll(
		filters?: IPermissionRequestFilters
	): Promise<IPermissionRequestResponse> {
		const params: Record<string, any> = {}

		if (filters?.status) {
			params.status = filters.status
		}
		if (filters?.requestedRole) {
			params.requestedRole = filters.requestedRole
		}
		if (filters?.limit) {
			params.limit = filters.limit
		}
		if (filters?.page && filters?.limit) {
			params.offset = (filters.page - 1) * filters.limit
		}

		const { data } = await axiosWithAuth.get<
			IPermissionRequest[] | IPermissionRequestApiResponse
		>('/permission-requests', {
			params
		})

		if (Array.isArray(data)) {
			return {
				items: data,
				total: data.length
			}
		}

		return {
			items: data.data || [],
			total: data.meta?.total || 0
		}
	},

	async create(dto: ICreatePermissionRequestDto): Promise<IPermissionRequest> {
		const { data } = await axiosWithAuth.post<IPermissionRequest>(
			'/permission-requests',
			dto
		)
		return data
	},

	async approve(
		id: string,
		dto?: IApproveRequestDto
	): Promise<IPermissionRequest> {
		const { data } = await axiosWithAuth.patch<IPermissionRequest>(
			`/permission-requests/${id}/approve`,
			dto
		)
		return data
	},

	async reject(
		id: string,
		dto?: IRejectRequestDto
	): Promise<IPermissionRequest> {
		const { data } = await axiosWithAuth.patch<IPermissionRequest>(
			`/permission-requests/${id}/reject`,
			dto
		)
		return data
	}
}
