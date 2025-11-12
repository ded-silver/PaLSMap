import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import i18n from 'i18next'
import { toast } from 'react-toastify'

import { dictionaryApi } from './api'
import type {
	ICreateDictionaryDto,
	IDictionary,
	IUpdateDictionaryDto
} from './types'

export const useDictionaries = (search?: string) => {
	return useQuery({
		queryKey: ['dictionaries', search],
		queryFn: () => dictionaryApi.getAll(search),
		staleTime: 5 * 60 * 1000 // 5 минут
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
			toast.success(i18n.t('messages.createSuccess', { ns: 'dictionary' }))
		},
		onError: (error: any) => {
			let errorMessage = i18n.t('messages.createError', { ns: 'dictionary' })

			if (error?.response?.data?.message) {
				errorMessage = error.response.data.message
			} else if (error?.response?.status === 409) {
				errorMessage = i18n.t('messages.duplicateError', { ns: 'dictionary' })
			} else if (error?.response?.status === 403) {
				errorMessage = i18n.t('messages.forbiddenError', { ns: 'dictionary' })
			} else if (error?.response?.status === 401) {
				errorMessage = i18n.t('messages.unauthorizedError', {
					ns: 'dictionary'
				})
			}

			toast.error(errorMessage)
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
			toast.success(i18n.t('messages.updateSuccess', { ns: 'dictionary' }))
		},
		onError: (error: any) => {
			let errorMessage = i18n.t('messages.updateError', { ns: 'dictionary' })

			if (error?.response?.data?.message) {
				errorMessage = error.response.data.message
			} else if (error?.response?.status === 409) {
				errorMessage = i18n.t('messages.duplicateError', { ns: 'dictionary' })
			} else if (error?.response?.status === 403) {
				errorMessage = i18n.t('messages.forbiddenError', { ns: 'dictionary' })
			} else if (error?.response?.status === 401) {
				errorMessage = i18n.t('messages.unauthorizedError', {
					ns: 'dictionary'
				})
			} else if (error?.response?.status === 404) {
				errorMessage = i18n.t('messages.notFoundError', { ns: 'dictionary' })
			}

			toast.error(errorMessage)
		}
	})
}

export const useDeleteDictionary = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => dictionaryApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dictionaries'] })
			toast.success(i18n.t('messages.deleteSuccess', { ns: 'dictionary' }))
		},
		onError: (error: any) => {
			let errorMessage = i18n.t('messages.deleteError', { ns: 'dictionary' })

			if (error?.response?.data?.message) {
				errorMessage = error.response.data.message
			} else if (error?.response?.status === 403) {
				errorMessage = i18n.t('messages.forbiddenError', { ns: 'dictionary' })
			} else if (error?.response?.status === 401) {
				errorMessage = i18n.t('messages.unauthorizedError', {
					ns: 'dictionary'
				})
			} else if (error?.response?.status === 404) {
				errorMessage = i18n.t('messages.notFoundError', { ns: 'dictionary' })
			}

			toast.error(errorMessage)
		}
	})
}
