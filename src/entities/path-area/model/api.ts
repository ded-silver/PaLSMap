import type { CreatePathAreaDto, PathArea, UpdatePathAreaDto } from './types'
import { axiosWithAuth } from '@/shared/api'

export const pathAreaApi = {
	async getByCountry(countryId: string): Promise<PathArea[]> {
		const { data } = await axiosWithAuth.get<PathArea[]>(
			`/path-areas/country/${countryId}`
		)
		return data
	},

	async getById(id: string): Promise<PathArea> {
		const { data } = await axiosWithAuth.get<PathArea>(`/path-areas/${id}`)
		return data
	},

	async create(dto: CreatePathAreaDto): Promise<PathArea> {
		const { data } = await axiosWithAuth.post<PathArea>('/path-areas', dto)
		return data
	},

	async update(id: string, dto: UpdatePathAreaDto): Promise<PathArea> {
		const { data } = await axiosWithAuth.patch<PathArea>(
			`/path-areas/${id}`,
			dto
		)
		return data
	},

	async delete(id: string): Promise<void> {
		await axiosWithAuth.delete(`/path-areas/${id}`)
	}
}
