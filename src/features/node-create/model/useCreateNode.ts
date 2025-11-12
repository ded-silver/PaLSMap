import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { NodeService } from '@/entities/node'
import type { NodeDto } from '@/entities/node'

export const useCreateNode = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['node'],
		mutationFn: (data: NodeDto) => NodeService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
			toast.success('Объект успешно добавлен.')
		},
		onError: () => toast.error('Ошибка добавления узла.')
	})
}
