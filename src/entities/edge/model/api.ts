import type { EdgeDto } from './types'
import { axiosWithAuth } from '@/shared/api'

export const EdgeService = {
	async getAll(pathAreaId?: string): Promise<EdgeDto[]> {
		const { data } = await axiosWithAuth.get<EdgeDto[]>('/edges', {
			params: pathAreaId ? { pathAreaId } : undefined
		})
		return data
	},

	async getByCountry(countryId: string): Promise<EdgeDto[]> {
		const { data } = await axiosWithAuth.get<EdgeDto[]>(
			`/edges/country/${countryId}`
		)
		return data
	},

	async create(edge: EdgeDto): Promise<EdgeDto> {
		const { data } = await axiosWithAuth.post<EdgeDto>('/edges', edge)
		return data
	},

	async delete(id: string): Promise<void> {
		await axiosWithAuth.delete(`/edges/${id}`)
	}
}
