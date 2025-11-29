import type { Country, CreateCountryDto, UpdateCountryDto } from './types'
import { axiosWithAuth } from '@/shared/api'

export const countryApi = {
	async getAll(): Promise<Country[]> {
		const { data } = await axiosWithAuth.get<Country[]>('/countries')
		return data
	},

	async getById(id: string): Promise<Country> {
		const { data } = await axiosWithAuth.get<Country>(`/countries/${id}`)
		return data
	},

	async create(dto: CreateCountryDto): Promise<Country> {
		const { data } = await axiosWithAuth.post<Country>('/countries', dto)
		return data
	},

	async update(id: string, dto: UpdateCountryDto): Promise<Country> {
		const { data } = await axiosWithAuth.patch<Country>(`/countries/${id}`, dto)
		return data
	},

	async delete(id: string): Promise<void> {
		await axiosWithAuth.delete(`/countries/${id}`)
	}
}
