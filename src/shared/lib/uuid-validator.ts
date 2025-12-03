const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isValidUUID = (uuid: string | undefined): boolean => {
	if (!uuid) return false
	return UUID_REGEX.test(uuid)
}
