import axios, {
	type CreateAxiosDefaults,
	type InternalAxiosRequestConfig
} from 'axios'
import { toast } from 'react-toastify'

import { errorCatch } from './error'
import { authService } from '@/entities/user'
import { resetAuthState } from '@/shared/lib/auth-manager'
import { getAccessToken } from '@/shared/lib/auth-token'

const options: CreateAxiosDefaults = {
	baseURL: `http://localhost:4201/api`,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const axiosClassic = axios.create(options)
const axiosWithAuth = axios.create(options)

const isPublicEndpoint = (url: string | undefined): boolean => {
	if (!url) return false
	const publicPaths = [
		'/auth/login',
		'/auth/register',
		'/auth/login/access-token',
		'/auth/logout'
	]
	return publicPaths.some(path => url.includes(path))
}

axiosWithAuth.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (config?.headers && accessToken)
		config.headers.Authorization = `Bearer ${accessToken}`

	if (config.data instanceof FormData) {
		delete config.headers['Content-Type']
	}

	return config
})

axiosWithAuth.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_isRetry?: boolean
		}
		const status = error?.response?.status
		const url =
			originalRequest?.url || error?.config?.url || error?.request?.responseURL

		if (status === 401) {
			if (isPublicEndpoint(url)) {
				throw error
			}

			if (originalRequest && !originalRequest._isRetry) {
				originalRequest._isRetry = true
				try {
					await authService.getNewTokens()
					return axiosWithAuth.request(originalRequest)
				} catch (refreshError) {
					resetAuthState()
					if (window.location.pathname !== '/auth') {
						window.location.href = '/auth'
					}
					throw refreshError
				}
			} else {
				resetAuthState()
				if (window.location.pathname !== '/auth') {
					window.location.href = '/auth'
				}
				throw error
			}
		}

		if (status === 403) {
			if (isPublicEndpoint(url)) {
				throw error
			}

			if (
				window.location.pathname !== '/map' &&
				!window.location.pathname.startsWith('/map')
			) {
				window.location.href = '/map'
			}
			throw error
		}

		if (
			(errorCatch(error) === 'jwt expired' ||
				errorCatch(error) === 'jwt must be provided') &&
			originalRequest &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true
			try {
				await authService.getNewTokens()
				return axiosWithAuth.request(originalRequest)
			} catch (refreshError) {
				if (errorCatch(refreshError) === 'jwt expired') {
					resetAuthState()
					if (window.location.pathname !== '/auth') {
						window.location.href = '/auth'
					}
				}
				throw refreshError
			}
		}

		throw error
	}
)

export { axiosClassic, axiosWithAuth }
