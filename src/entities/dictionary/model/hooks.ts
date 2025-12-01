import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import i18n from 'i18next'
import { toast } from 'react-toastify'

import { dictionaryApi } from './api'
import type {
	ICreateDictionaryDto,
	IDictionary,
	IUpdateDictionaryDto
} from './types'
import {
	type ErrorResponse,
	handleMutationError,
	handleMutationSuccess
} from '@/shared/lib/error-handler'

export const useDictionaries = (search?: string) => {
	return useQuery({
		queryKey: ['dictionaries', search],
		queryFn: () => dictionaryApi.getAll(search),
		staleTime: 5 * 60 * 1000
	})
}

export const useDictionary = (id: string) => {
	return useQuery({
		queryKey: ['dictionary', id],
		queryFn: () => dictionaryApi.getById(id),
		enabled: !!id
	})
}

export const useCreateDictionary = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (dto: ICreateDictionaryDto) => dictionaryApi.create(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dictionaries'] })
			handleMutationSuccess({
				successKey: 'messages.createSuccess',
				namespace: 'dictionary'
			})
		},
		onError: (error: ErrorResponse) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.createError',
				namespace: 'dictionary'
			})
		}
	})
}

export const useUpdateDictionary = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: IUpdateDictionaryDto }) =>
			dictionaryApi.update(id, dto),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['dictionaries'] })
			queryClient.invalidateQueries({
				queryKey: ['dictionary', variables.id]
			})
			handleMutationSuccess({
				successKey: 'messages.updateSuccess',
				namespace: 'dictionary'
			})
		},
		onError: (error: ErrorResponse) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.updateError',
				namespace: 'dictionary'
			})
		}
	})
}

export const useDeleteDictionary = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => dictionaryApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dictionaries'] })
			handleMutationSuccess({
				successKey: 'messages.deleteSuccess',
				namespace: 'dictionary'
			})
		},
		onError: (error: ErrorResponse) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.deleteError',
				namespace: 'dictionary'
			})
		}
	})
}
