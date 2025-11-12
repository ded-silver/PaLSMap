import type { IAuthForm, IAuthResponse, IProfileResponse, IUser } from './types'
import { axiosClassic, axiosWithAuth } from '@/shared/api'
import { removeFromStorage, saveTokenStorage } from '@/shared/lib/auth-token'

export const authService = {
	async main(type: 'login' | 'register', data: IAuthForm) {
		const response = await axiosClassic.post<IAuthResponse>(
			`/auth/${type}`,
			data
		)
		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)
		return response
	},

	async getNewTokens() {
		const response = await axiosClassic.post<IAuthResponse>(
			'/auth/login/access-token'
		)

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

		return response
	},

	async logout() {
		const response = await axiosClassic.post<boolean>('/auth/logout')

		if (response.data) removeFromStorage()

		return response
	}
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
