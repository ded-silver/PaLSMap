import { axiosWithAuth } from '../api/interceptiors'
import { IUser } from '../types/auth.types'

export interface IProfileResponse {
	user: IUser
	name?: string
	isAdmin: boolean
}

class UserService {
	private BASE_URL = '/user/profile'

	async getProfile() {
		const response = await axiosWithAuth.get<IProfileResponse>(this.BASE_URL)
		return response.data
	}

	async updateProfile(profileData: Partial<IUser>) {
		const response = await axiosWithAuth.put<IProfileResponse>(
			this.BASE_URL,
			profileData
		)
		return response.data
	}

	async requestRightsUpgrade() {
		const response = await axiosWithAuth.post<{ success: boolean }>(
			`${this.BASE_URL}/request-upgrade`
		)
		return response.data
	}
}

export const userService = new UserService()

export const getUserInfo = async () => {
	const response = await userService.getProfile()
	return response.user
}
