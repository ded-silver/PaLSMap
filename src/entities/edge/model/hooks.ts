import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { EdgeService } from './api'
import type { EdgeDto } from './types'

export function useEdges() {
	const { data } = useQuery({
		queryKey: ['edges'],
		queryFn: () => EdgeService.getAll()
	})

	const [items, setItems] = useState<EdgeDto[] | undefined>(data)

	useEffect(() => {
		setItems(data)
	}, [data])
	return { items, setItems }
}

export const useCreateEdge = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: EdgeService.create,
		onSuccess: () => {
			toast.success('Связь успешно создана')
			queryClient.invalidateQueries({ queryKey: ['edges'] })
		},
		onError: () => {
			toast.error('Ошибка при создании связи')
		}
	})
}

export const useDeleteEdge = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => EdgeService.delete(id),
		onSuccess: () => {
			toast.success('Связь удалена')
			queryClient.invalidateQueries({ queryKey: ['edges'] })
		},
		onError: () => {
			toast.error('Ошибка при удалении связи')
		}
	})
}
