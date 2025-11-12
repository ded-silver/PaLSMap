export enum EnumTokens {
	'ACCESS_TOKEN' = 'accessToken',
	'REFRESH_TOKEN' = 'refreshToken'
}

export const getAccessToken = () => {
	const accessToken = localStorage.getItem('accesstoken')
	return accessToken || null
}

export const saveTokenStorage = (accessToken: string) => {
	localStorage.setItem('accesstoken', accessToken)
}

export const removeFromStorage = () => {
	localStorage.removeItem('accesstoken')
}
