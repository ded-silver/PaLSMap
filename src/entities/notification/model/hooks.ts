import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient
} from '@tanstack/react-query'

import { notificationApi } from './api'
import type { INotificationFilters } from './types'
import {
	type ErrorResponse,
	handleMutationError,
	handleMutationSuccess
} from '@/shared/lib/error-handler'

export const useNotifications = (filters?: INotificationFilters) => {
	return useQuery({
		queryKey: ['notifications', filters],
		queryFn: () => notificationApi.getAll(filters),
		staleTime: 30 * 1000,
		refetchInterval: 30 * 1000,
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		retry: 2,
		retryDelay: 1000
	})
}

export const useInfiniteNotifications = (filters?: INotificationFilters) => {
	const limit = filters?.limit || 20

	return useInfiniteQuery({
		queryKey: ['notifications', 'infinite', filters],
		queryFn: ({ pageParam = 1 }) =>
			notificationApi.getAll({
				...filters,
				page: pageParam,
				limit
			}),
		getNextPageParam: (lastPage, allPages) => {
			const totalLoaded = allPages.reduce(
				(sum, page) => sum + page.items.length,
				0
			)
			if (totalLoaded < lastPage.total) {
				return allPages.length + 1
			}
			return undefined
		},
		initialPageParam: 1,
		staleTime: 30 * 1000,
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		retry: 2,
		retryDelay: 1000
	})
}

export const useUnreadCount = () => {
	return useQuery({
		queryKey: ['notifications', 'unread-count'],
		queryFn: () => notificationApi.getUnreadCount(),
		staleTime: 30 * 1000,
		refetchInterval: 30 * 1000,
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		retry: 2,
		retryDelay: 1000
	})
}

export const useMarkAsRead = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => notificationApi.markAsRead(id),
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: ['notifications'] })
			await queryClient.cancelQueries({
				queryKey: ['notifications', 'unread-count']
			})

			const previousNotifications = queryClient.getQueryData(['notifications'])
			const previousUnreadCount = queryClient.getQueryData([
				'notifications',
				'unread-count'
			])

			queryClient.setQueryData(['notifications'], (old: any) => {
				if (!old) return old
				return {
					...old,
					items: old.items.map((notification: any) =>
						notification.id === id
							? {
									...notification,
									read: true,
									readAt: new Date().toISOString()
								}
							: notification
					)
				}
			})

			queryClient.setQueryData(
				['notifications', 'unread-count'],
				(old: any) => {
					if (!old) return old
					const currentCount = old.count || 0
					return { count: Math.max(0, currentCount - 1) }
				}
			)

			return { previousNotifications, previousUnreadCount }
		},
		onError: (error: ErrorResponse, _id, context) => {
			if (context?.previousNotifications) {
				queryClient.setQueryData(
					['notifications'],
					context.previousNotifications
				)
			}
			if (context?.previousUnreadCount) {
				queryClient.setQueryData(
					['notifications', 'unread-count'],
					context.previousUnreadCount
				)
			}
			handleMutationError(error, {
				defaultErrorKey: 'messages.markAsReadError',
				namespace: 'notifications'
			})
		},
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['notifications'] })
			queryClient.refetchQueries({
				queryKey: ['notifications', 'unread-count']
			})
		}
	})
}

export const useMarkAllAsRead = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: () => notificationApi.markAllAsRead(),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ['notifications'] })
			await queryClient.cancelQueries({
				queryKey: ['notifications', 'unread-count']
			})

			const previousNotifications = queryClient.getQueryData(['notifications'])
			const previousUnreadCount = queryClient.getQueryData([
				'notifications',
				'unread-count'
			])

			queryClient.setQueryData(['notifications'], (old: any) => {
				if (!old) return old
				return {
					...old,
					items: old.items.map((notification: any) => ({
						...notification,
						read: true,
						readAt: notification.readAt || new Date().toISOString()
					}))
				}
			})

			queryClient.setQueryData(['notifications', 'unread-count'], { count: 0 })

			return { previousNotifications, previousUnreadCount }
		},
		onError: (error: ErrorResponse, _variables, context) => {
			if (context?.previousNotifications) {
				queryClient.setQueryData(
					['notifications'],
					context.previousNotifications
				)
			}
			if (context?.previousUnreadCount) {
				queryClient.setQueryData(
					['notifications', 'unread-count'],
					context.previousUnreadCount
				)
			}
			handleMutationError(error, {
				defaultErrorKey: 'messages.markAllAsReadError',
				namespace: 'notifications'
			})
		},
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['notifications'] })
			queryClient.refetchQueries({
				queryKey: ['notifications', 'unread-count']
			})
			handleMutationSuccess({
				successKey: 'messages.markAllAsReadSuccess',
				namespace: 'notifications'
			})
		}
	})
}

export const useDeleteNotification = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => notificationApi.deleteNotification(id),
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: ['notifications'] })
			await queryClient.cancelQueries({
				queryKey: ['notifications', 'unread-count']
			})

			const previousNotifications = queryClient.getQueryData(['notifications'])
			const previousUnreadCount = queryClient.getQueryData([
				'notifications',
				'unread-count'
			])

			queryClient.setQueryData(['notifications'], (old: any) => {
				if (!old) return old
				const deletedNotification = old.items.find((n: any) => n.id === id)
				return {
					...old,
					items: old.items.filter(
						(notification: any) => notification.id !== id
					),
					total: old.total - 1
				}
			})

			queryClient.setQueryData(
				['notifications', 'unread-count'],
				(old: any) => {
					if (!old) return old
					const deletedNotification = (
						previousNotifications as any
					)?.items?.find((n: any) => n.id === id)
					if (deletedNotification && !deletedNotification.read) {
						const currentCount = old.count || 0
						return { count: Math.max(0, currentCount - 1) }
					}
					return old
				}
			)

			return { previousNotifications, previousUnreadCount }
		},
		onError: (error: ErrorResponse, _id, context) => {
			if (context?.previousNotifications) {
				queryClient.setQueryData(
					['notifications'],
					context.previousNotifications
				)
			}
			if (context?.previousUnreadCount) {
				queryClient.setQueryData(
					['notifications', 'unread-count'],
					context.previousUnreadCount
				)
			}
			handleMutationError(error, {
				defaultErrorKey: 'messages.deleteError',
				namespace: 'notifications'
			})
		},
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['notifications'] })
			queryClient.refetchQueries({
				queryKey: ['notifications', 'unread-count']
			})
			handleMutationSuccess({
				successKey: 'messages.deleteSuccess',
				namespace: 'notifications'
			})
		}
	})
}
