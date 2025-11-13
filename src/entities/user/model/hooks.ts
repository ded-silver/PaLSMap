import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { userService } from './api'
import type { IProfileResponse } from './types'
import { getAccessToken } from '@/shared/lib/auth-token'

const USER_PROFILE_QUERY_KEY = ['user', 'profile'] as const

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
