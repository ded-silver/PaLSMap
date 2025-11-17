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
	isSuperAdmin?: boolean
	createdAt: string
	updatedAt: string
}

export interface IChangePasswordDto {
	currentPassword: string
	newPassword: string
	confirmPassword: string
}

export interface IUserForAdmin {
	id: string
	email: string
	name: string | null
	position: string | null
	avatar: string | null
	isAdmin: boolean
	isSuperAdmin: boolean
	createdAt: string
	updatedAt: string
}

export interface IUpdateUserByAdminDto {
	position?: string
	isAdmin?: boolean
}
