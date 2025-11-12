export interface IDictionary {
	id: string
	short: string
	full: string
	createdAt: string
	updatedAt: string
}

export interface IDictionaryResponse {
	items: IDictionary[]
	total: number
}

export interface ICreateDictionaryDto {
	short: string
	full: string
}

export interface IUpdateDictionaryDto {
	short?: string
	full?: string
}
