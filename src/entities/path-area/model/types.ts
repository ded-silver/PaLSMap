export interface PathArea {
	id: string
	name: string
	countryId: string
	createdAt: string
	updatedAt: string
}

export interface CreatePathAreaDto {
	name: string
	countryId: string
}

export interface UpdatePathAreaDto {
	name?: string
	countryId?: string
}
