import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { countryApi } from './api'
import type { CreateCountryDto, UpdateCountryDto } from './types'
import {
	handleMutationError,
	handleMutationSuccess
} from '@/shared/lib/error-handler'

export const useCountries = () => {
	return useQuery({
		queryKey: ['countries'],
		queryFn: () => countryApi.getAll(),
		staleTime: 5 * 60 * 1000
	})
}

export const useCountry = (id: string) => {
	return useQuery({
		queryKey: ['country', id],
		queryFn: () => countryApi.getById(id),
		enabled: !!id
	})
}

export const useCreateCountry = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (dto: CreateCountryDto) => countryApi.create(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['countries'] })
			handleMutationSuccess({
				successKey: 'messages.createSuccess',
				namespace: 'path-areas'
			})
		},
		onError: (error: any) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.createError',
				namespace: 'path-areas'
			})
		}
	})
}

export const useUpdateCountry = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateCountryDto }) =>
			countryApi.update(id, dto),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['countries'] })
			queryClient.invalidateQueries({
				queryKey: ['country', variables.id]
			})
			handleMutationSuccess({
				successKey: 'messages.updateSuccess',
				namespace: 'path-areas'
			})
		},
		onError: (error: any) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.updateError',
				namespace: 'path-areas'
			})
		}
	})
}

export const useDeleteCountry = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => countryApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['countries'] })
			handleMutationSuccess({
				successKey: 'messages.deleteSuccess',
				namespace: 'path-areas'
			})
		},
		onError: (error: any) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.deleteError',
				namespace: 'path-areas'
			})
		}
	})
}
