export const getMapVersionUrl = (
	countryId: string,
	areaId: string,
	versionId?: string
): string => {
	const baseUrl = `/map/${countryId}/${areaId}`
	return versionId ? `${baseUrl}?version=${versionId}` : baseUrl
}

export const getMapVersionsListUrl = (
	countryId: string,
	areaId: string
): string => {
	return `/map/${countryId}/${areaId}/versions`
}
