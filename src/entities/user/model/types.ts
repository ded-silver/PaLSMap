export interface IAuthForm {
	email: string
	password: string
	name?: string
	isAdmin?: boolean
}

export interface IUser {
	id: number
	name?: string
	email: string
}

export interface IAuthResponse {
	accessToken: string
	user: IUser
}

export interface IProfileResponse {
	user: IUser
	name?: string
	isAdmin: boolean
}
