import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import i18n from 'i18next'
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
			toast.success(i18n.t('messages.createEdgeSuccess', { ns: 'nodes' }))
			queryClient.invalidateQueries({ queryKey: ['edges'] })
		},
		onError: () => {
			toast.error(i18n.t('messages.createEdgeError', { ns: 'nodes' }))
		}
	})
}

export const useDeleteEdge = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => EdgeService.delete(id),
		onSuccess: () => {
			toast.success(i18n.t('messages.deleteEdgeSuccess', { ns: 'nodes' }))
			queryClient.invalidateQueries({ queryKey: ['edges'] })
		},
		onError: () => {
			toast.error(i18n.t('messages.deleteEdgeError', { ns: 'nodes' }))
		}
	})
}
