import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { pathAreaApi } from './api'
import type { CreatePathAreaDto, UpdatePathAreaDto } from './types'
import {
	type ErrorResponse,
	handleMutationError,
	handleMutationSuccess
} from '@/shared/lib/error-handler'

export const usePathAreasByCountry = (countryId: string) => {
	return useQuery({
		queryKey: ['path-areas', 'country', countryId],
		queryFn: () => pathAreaApi.getByCountry(countryId),
		enabled: !!countryId,
		staleTime: 5 * 60 * 1000
	})
}

export const usePathArea = (id: string) => {
	return useQuery({
		queryKey: ['path-area', id],
		queryFn: () => pathAreaApi.getById(id),
		enabled: !!id
	})
}

export const useCreatePathArea = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (dto: CreatePathAreaDto) => pathAreaApi.create(dto),
		onSuccess: data => {
			queryClient.invalidateQueries({
				queryKey: ['path-areas', 'country', data.countryId]
			})
			queryClient.invalidateQueries({ queryKey: ['path-areas'] })
			handleMutationSuccess({
				successKey: 'messages.createSuccess',
				namespace: 'path-areas'
			})
		},
		onError: (error: ErrorResponse) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.createError',
				namespace: 'path-areas'
			})
		}
	})
}

export const useUpdatePathArea = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdatePathAreaDto }) =>
			pathAreaApi.update(id, dto),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['path-areas', 'country', data.countryId]
			})
			queryClient.invalidateQueries({
				queryKey: ['path-area', variables.id]
			})
			queryClient.invalidateQueries({ queryKey: ['path-areas'] })
			handleMutationSuccess({
				successKey: 'messages.updateSuccess',
				namespace: 'path-areas'
			})
		},
		onError: (error: ErrorResponse) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.updateError',
				namespace: 'path-areas'
			})
		}
	})
}

export const useDeletePathArea = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, countryId }: { id: string; countryId: string }) =>
			pathAreaApi.delete(id),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['path-areas', 'country', variables.countryId]
			})
			queryClient.invalidateQueries({ queryKey: ['path-areas'] })
			queryClient.invalidateQueries({ queryKey: ['path-area', variables.id] })
			handleMutationSuccess({
				successKey: 'messages.deleteSuccess',
				namespace: 'path-areas'
			})
		},
		onError: (error: ErrorResponse) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.deleteError',
				namespace: 'path-areas'
			})
		}
	})
}
