import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { userService } from './api'
import type {
	IChangePasswordDto,
	IProfileResponse,
	IUpdateUserByAdminDto,
	IUser
} from './types'
import { getAccessToken } from '@/shared/lib/auth-token'
import type { ErrorResponse } from '@/shared/lib/error-handler'

export const USER_PROFILE_QUERY_KEY = ['user', 'profile'] as const

export const useUserProfile = () => {
	const accessToken = getAccessToken()
	const queryClient = useQueryClient()

	useEffect(() => {
		if (!accessToken) {
			queryClient.removeQueries({ queryKey: USER_PROFILE_QUERY_KEY })
		}
	}, [accessToken, queryClient])

	return useQuery<IProfileResponse>({
		queryKey: USER_PROFILE_QUERY_KEY,
		queryFn: () => userService.getProfile(),
		enabled: !!accessToken,
		staleTime: 5 * 60 * 1000,
		retry: false,
		refetchOnWindowFocus: false
	})
}

export const useIsAdmin = (): boolean => {
	const { data, isError } = useUserProfile()

	if (isError || !data) {
		return false
	}

	return data.isAdmin ?? false
}

export const useIsAdminWithLoading = (): {
	isAdmin: boolean
	isLoading: boolean
} => {
	const { data, isError, isLoading } = useUserProfile()

	if (isLoading) {
		return { isAdmin: false, isLoading: true }
	}

	if (isError || !data) {
		return { isAdmin: false, isLoading: false }
	}

	return { isAdmin: data.isAdmin ?? false, isLoading: false }
}

export const useIsSuperAdmin = (): boolean => {
	const { data, isError } = useUserProfile()

	if (isError || !data) {
		return false
	}

	return data.isSuperAdmin ?? false
}

export const useUpdateProfile = () => {
	const queryClient = useQueryClient()
	const { t } = useTranslation('common')

	return useMutation({
		mutationFn: (data: Partial<IUser>) => userService.updateProfile(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
			toast.success(t('profile.saveSuccess'))
		},
		onError: (error: ErrorResponse) => {
			const message =
				error?.response?.data?.message || t('errors.profileUpdateError')
			toast.error(message)
		}
	})
}

export const useChangePassword = () => {
	const queryClient = useQueryClient()
	const { t } = useTranslation('common')

	return useMutation({
		mutationFn: (dto: IChangePasswordDto) => userService.changePassword(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
			toast.success(t('profile.passwordChangedSuccess'))
		},
		onError: (error: ErrorResponse) => {
			const message =
				error?.response?.data?.message || t('errors.passwordChangeError')
			toast.error(message)
		}
	})
}

export const useUploadAvatar = () => {
	const queryClient = useQueryClient()
	const { t } = useTranslation('common')

	return useMutation({
		mutationFn: (file: File) => userService.uploadAvatar(file),
		onSuccess: data => {
			queryClient.setQueryData<IProfileResponse>(USER_PROFILE_QUERY_KEY, data)
			toast.success(t('profile.avatar.uploadSuccess'))
		},
		onError: (error: ErrorResponse) => {
			const message =
				error?.response?.data?.message || t('profile.avatar.uploadError')
			toast.error(message)
		}
	})
}

export const useAllUsers = () => {
	return useQuery({
		queryKey: ['users', 'all'],
		queryFn: () => userService.getAllUsers(),
		retry: false
	})
}

export const useUpdateUserByAdmin = () => {
	const queryClient = useQueryClient()
	const { t } = useTranslation('admin')

	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: IUpdateUserByAdminDto }) =>
			userService.updateUserByAdmin(id, dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users', 'all'] })
			toast.success(t('saved'))
		},
		onError: (error: ErrorResponse) => {
			const message = error?.response?.data?.message || t('error')
			toast.error(message)
		}
	})
}
