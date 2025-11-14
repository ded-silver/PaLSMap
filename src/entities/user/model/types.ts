export interface IAuthForm {
	email: string
	password: string
	name?: string
	isAdmin?: boolean
}

export interface IUser {
	id: string
	name?: string
	email: string
	position?: string
	avatar?: string
	isAdmin: boolean
	createdAt?: string
	updatedAt?: string
}

export interface IAuthResponse {
	accessToken: string
	user: IUser
}

export interface IProfileResponse {
	id: string
	name?: string
	email: string
	position?: string
	avatar?: string
	isAdmin: boolean
	createdAt: string
	updatedAt: string
}

export interface IChangePasswordDto {
	currentPassword: string
	newPassword: string
	confirmPassword: string
}
