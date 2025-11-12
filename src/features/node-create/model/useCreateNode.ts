import { useMutation, useQueryClient } from '@tanstack/react-query'
import i18n from 'i18next'
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
			toast.success(i18n.t('messages.addSuccess', { ns: 'nodes' }))
		},
		onError: () => toast.error(i18n.t('messages.addError', { ns: 'nodes' }))
	})
}
