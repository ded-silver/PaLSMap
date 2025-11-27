export enum EnumTokens {
	ACCESS_TOKEN = 'accessToken',
	REFRESH_TOKEN = 'refreshToken'
}

const isBrowser = typeof window !== 'undefined'

const getLocalStorage = () => {
	if (!isBrowser) return null
	try {
		return window.localStorage
	} catch {
		return null
	}
}

const getSessionStorage = () => {
	if (!isBrowser) return null
	try {
		return window.sessionStorage
	} catch {
		return null
	}
}

export const getAccessToken = () => {
	const storage = getLocalStorage()
	return storage?.getItem(EnumTokens.ACCESS_TOKEN) ?? null
}

export const saveTokenStorage = (accessToken: string) => {
	const storage = getLocalStorage()
	storage?.setItem(EnumTokens.ACCESS_TOKEN, accessToken)
}

export const removeFromStorage = () => {
	const storage = getLocalStorage()
	storage?.removeItem(EnumTokens.ACCESS_TOKEN)
}

export const clearClientStorage = () => {
	const local = getLocalStorage()
	const session = getSessionStorage()

	local?.clear()
	session?.clear()
}

export const hasRefreshTokenCookie = () => {
	if (!isBrowser || typeof document === 'undefined') return false

	return document.cookie
		.split(';')
		.some(cookie => cookie.trim().startsWith(`${EnumTokens.REFRESH_TOKEN}=`))
}
