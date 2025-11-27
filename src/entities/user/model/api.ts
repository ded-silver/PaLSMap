import type {
	IAuthForm,
	IAuthResponse,
	IChangePasswordDto,
	IProfileResponse,
	IUpdateUserByAdminDto,
	IUser,
	IUserForAdmin
} from './types'
import { axiosClassic, axiosWithAuth } from '@/shared/api'
import { resetAuthState } from '@/shared/lib/auth-manager'
import { saveTokenStorage } from '@/shared/lib/auth-token'

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
		try {
			return await axiosClassic.post<boolean>('/auth/logout')
		} finally {
			resetAuthState()
		}
	}
}

class UserService {
	private BASE_URL = '/user/profile'
	private ADMIN_BASE_URL = '/user/admin/users'

	async getProfile() {
		const response = await axiosWithAuth.get<IProfileResponse>(this.BASE_URL)
		return response.data
	}

	async updateProfile(profileData: Partial<IUser>) {
		const filteredData = Object.fromEntries(
			Object.entries(profileData).filter(([_, value]) => value !== undefined)
		) as Partial<IUser>

		const response = await axiosWithAuth.put<IProfileResponse>(
			this.BASE_URL,
			filteredData
		)
		return response.data
	}

	async requestRightsUpgrade() {
		const response = await axiosWithAuth.post<{ success: boolean }>(
			`${this.BASE_URL}/request-upgrade`
		)
		return response.data
	}

	async changePassword(dto: IChangePasswordDto) {
		const response = await axiosWithAuth.post<{
			success: boolean
			message: string
		}>(`${this.BASE_URL}/change-password`, dto)
		return response.data
	}

	async uploadAvatar(file: File) {
		const formData = new FormData()
		formData.append('avatar', file)

		const response = await axiosWithAuth.post<IProfileResponse>(
			`${this.BASE_URL}/avatar/upload`,
			formData
		)
		return response.data
	}

	async getAllUsers() {
		const response = await axiosWithAuth.get<IUserForAdmin[]>(
			this.ADMIN_BASE_URL
		)
		return response.data
	}

	async updateUserByAdmin(id: string, dto: IUpdateUserByAdminDto) {
		const response = await axiosWithAuth.put<IUserForAdmin>(
			`${this.ADMIN_BASE_URL}/${id}`,
			dto
		)
		return response.data
	}
}

export const userService = new UserService()

export const getUserInfo = async () => {
	const response = await userService.getProfile()
	return response
}
