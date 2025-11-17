export const normalizeAvatarUrl = (
	avatarPath: string | null | undefined,
	updatedAt?: string | null
): string | undefined => {
	if (!avatarPath) return undefined

	if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
		return addVersionParam(avatarPath, updatedAt)
	}
	const API_BASE_URL =
		import.meta.env.VITE_API_BASE_URL || 'http://localhost:4201'
	const normalizedPath = avatarPath.startsWith('/')
		? `${API_BASE_URL}${avatarPath}`
		: `${API_BASE_URL}/${avatarPath}`

	return addVersionParam(normalizedPath, updatedAt)
}

const addVersionParam = (url: string, updatedAt?: string | null): string => {
	const version = updatedAt || Date.now()
	const separator = url.includes('?') ? '&' : '?'
	return `${url}${separator}v=${version}`
}
