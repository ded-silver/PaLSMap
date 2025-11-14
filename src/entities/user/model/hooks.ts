import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { userService } from './api'
import type { IChangePasswordDto, IProfileResponse, IUser } from './types'
import { getAccessToken } from '@/shared/lib/auth-token'

export const USER_PROFILE_QUERY_KEY = ['user', 'profile'] as const

export const useUserProfile = () => {
	const accessToken = useMemo(() => getAccessToken(), [])

	return useQuery<IProfileResponse>({
		queryKey: USER_PROFILE_QUERY_KEY,
		queryFn: () => userService.getProfile(),
		enabled: !!accessToken,
		staleTime: 5 * 60 * 1000, // 5 минут
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

export const useUpdateProfile = () => {
	const queryClient = useQueryClient()
	const { t } = useTranslation('common')

	return useMutation({
		mutationFn: (data: Partial<IUser>) => userService.updateProfile(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
			toast.success(t('profile.saveSuccess'))
		},
		onError: (error: any) => {
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
		onError: (error: any) => {
			const message =
				error?.response?.data?.message || t('errors.passwordChangeError')
			toast.error(message)
		}
	})
}
