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
				successKey: 'messages.createdSuccess',
				namespace: 'common'
			})
		},
		onError: (error: ErrorResponse) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.errorCreating',
				namespace: 'common'
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
				successKey: 'messages.updatedSuccess',
				namespace: 'common'
			})
		},
		onError: (error: ErrorResponse) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.errorUpdating',
				namespace: 'common'
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
				successKey: 'messages.deletedSuccess',
				namespace: 'common'
			})
		},
		onError: (error: ErrorResponse) => {
			handleMutationError(error, {
				defaultErrorKey: 'messages.errorDeleting',
				namespace: 'common'
			})
		}
	})
}
