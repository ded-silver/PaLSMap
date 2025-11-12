import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { NodeService } from '@/entities/node'

export const useDeleteNode = (queryKey: string[] = ['nodes']) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['deleteNode'],
		mutationFn: (id: string) => NodeService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey })
		},
		onError: () => toast.error('Ошибка при удалении узла.')
	})
}
