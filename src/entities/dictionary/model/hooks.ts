import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
			toast.success('Запись успешно создана')
		},
		onError: (error: any) => {
			let errorMessage = 'Ошибка при создании записи'

			if (error?.response?.data?.message) {
				errorMessage = error.response.data.message
			} else if (error?.response?.status === 409) {
				errorMessage = 'Аббревиатура уже существует'
			} else if (error?.response?.status === 403) {
				errorMessage = 'Недостаточно прав для выполнения операции'
			} else if (error?.response?.status === 401) {
				errorMessage = 'Необходима авторизация'
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
			toast.success('Запись успешно обновлена')
		},
		onError: (error: any) => {
			let errorMessage = 'Ошибка при обновлении записи'

			if (error?.response?.data?.message) {
				errorMessage = error.response.data.message
			} else if (error?.response?.status === 409) {
				errorMessage = 'Аббревиатура уже существует'
			} else if (error?.response?.status === 403) {
				errorMessage = 'Недостаточно прав для выполнения операции'
			} else if (error?.response?.status === 401) {
				errorMessage = 'Необходима авторизация'
			} else if (error?.response?.status === 404) {
				errorMessage = 'Запись не найдена'
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
			toast.success('Запись успешно удалена')
		},
		onError: (error: any) => {
			let errorMessage = 'Ошибка при удалении записи'

			if (error?.response?.data?.message) {
				errorMessage = error.response.data.message
			} else if (error?.response?.status === 403) {
				errorMessage = 'Недостаточно прав для выполнения операции'
			} else if (error?.response?.status === 401) {
				errorMessage = 'Необходима авторизация'
			} else if (error?.response?.status === 404) {
				errorMessage = 'Запись не найдена'
			}

			toast.error(errorMessage)
		}
	})
}
