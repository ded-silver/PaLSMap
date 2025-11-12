import type {
	ICreateDictionaryDto,
	IDictionary,
	IDictionaryResponse,
	IUpdateDictionaryDto
} from './types'
import { axiosWithAuth } from '@/shared/api'

export const dictionaryApi = {
	async getAll(search?: string): Promise<IDictionaryResponse> {
		const { data } = await axiosWithAuth.get<IDictionaryResponse>(
			'/dictionary',
			{
				params: search ? { search } : undefined
			}
		)
		return data
	},

	async getById(id: string): Promise<IDictionary> {
		const { data } = await axiosWithAuth.get<IDictionary>(`/dictionary/${id}`)
		return data
	},

	async create(dto: ICreateDictionaryDto): Promise<IDictionary> {
		const { data } = await axiosWithAuth.post<IDictionary>('/dictionary', dto)
		return data
	},

	async update(id: string, dto: IUpdateDictionaryDto): Promise<IDictionary> {
		const { data } = await axiosWithAuth.patch<IDictionary>(
			`/dictionary/${id}`,
			dto
		)
		return data
	},

	async delete(id: string): Promise<void> {
		await axiosWithAuth.delete(`/dictionary/${id}`)
	}
}
