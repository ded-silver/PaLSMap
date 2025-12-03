import type {
	CreateMapVersionDto,
	DeleteVersionResponse,
	MapVersion,
	RestoreVersionResponse
} from './types'
import { axiosWithAuth } from '@/shared/api'

class MapVersionApi {
	private BASE_URL = '/map-versions'

	async createVersion(dto: CreateMapVersionDto): Promise<MapVersion> {
		const { data } = await axiosWithAuth.post<MapVersion>(this.BASE_URL, dto)
		return data
	}

	async getVersionsByPathArea(pathAreaId: string): Promise<MapVersion[]> {
		const { data } = await axiosWithAuth.get<MapVersion[]>(
			`${this.BASE_URL}/path-area/${pathAreaId}`
		)
		return data
	}

	async getVersion(versionId: string): Promise<MapVersion> {
		const { data } = await axiosWithAuth.get<MapVersion>(
			`${this.BASE_URL}/${versionId}`
		)
		return data
	}

	async restoreVersion(versionId: string): Promise<RestoreVersionResponse> {
		const { data } = await axiosWithAuth.post<RestoreVersionResponse>(
			`${this.BASE_URL}/${versionId}/restore`
		)
		return data
	}

	async deleteVersion(versionId: string): Promise<DeleteVersionResponse> {
		const { data } = await axiosWithAuth.delete<DeleteVersionResponse>(
			`${this.BASE_URL}/${versionId}`
		)
		return data
	}
}

const mapVersionApi = new MapVersionApi()

export { mapVersionApi }
