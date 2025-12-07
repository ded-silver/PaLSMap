import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { permissionRequestApi } from './api'
import type {
	IApproveRequestDto,
	ICreatePermissionRequestDto,
	IPermissionRequestFilters,
	IRejectRequestDto
} from './types'
import {
	type ErrorResponse,
	handleMutationError,
	handleMutationSuccess
} from '@/shared/lib/error-handler'

export const usePermissionRequests = (
	filters?: IPermissionRequestFilters,
	options?: { enablePolling?: boolean }
) => {
	return useQuery({
		queryKey: ['permission-requests', filters],
		queryFn: () => permissionRequestApi.getAll(filters),
		staleTime: 5 * 60 * 1000,
		refetchInterval: options?.enablePolling ? 30 * 1000 : false,
		refetchOnWindowFocus: false,
		refetchOnMount: true,
		retry: 2,
		retryDelay: 1000
	})
}

export const useCreatePermissionRequest = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (dto: ICreatePermissionRequestDto) =>
			permissionRequestApi.create(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['permission-requests'] })
			queryClient.refetchQueries({ queryKey: ['notifications'] })
			queryClient.refetchQueries({
				queryKey: ['notifications', 'unread-count']
			})
			handleMutationSuccess({
				successKey: 'messages.requestCreated',
				namespace: 'notifications'
			})
		},
		onError: (error: ErrorResponse) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.createError',
				namespace: 'notifications'
			})
		}
	})
}

export const useApproveRequest = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto?: IApproveRequestDto }) =>
			permissionRequestApi.approve(id, dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['permission-requests'] })
			queryClient.refetchQueries({ queryKey: ['notifications'] })
			queryClient.refetchQueries({
				queryKey: ['notifications', 'unread-count']
			})
			handleMutationSuccess({
				successKey: 'messages.requestApproved',
				namespace: 'notifications'
			})
		},
		onError: (error: ErrorResponse) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.approveError',
				namespace: 'notifications'
			})
		}
	})
}

export const useRejectRequest = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto?: IRejectRequestDto }) =>
			permissionRequestApi.reject(id, dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['permission-requests'] })
			queryClient.refetchQueries({ queryKey: ['notifications'] })
			queryClient.refetchQueries({
				queryKey: ['notifications', 'unread-count']
			})
			handleMutationSuccess({
				successKey: 'messages.requestRejected',
				namespace: 'notifications'
			})
		},
		onError: (error: ErrorResponse) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.rejectError',
				namespace: 'notifications'
			})
		}
	})
}
