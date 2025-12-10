import { useMutation, useQueryClient } from '@tanstack/react-query'
import i18n from 'i18next'
import { toast } from 'react-toastify'

import { NodeService } from '@/entities/node'
import type { NodeDto } from '@/entities/node'

export const useUpdateNode = (queryKey: string[] = ['nodes']) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['nodeUpdate'],
		mutationFn: (data: NodeDto) => NodeService.update(data.id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey })
		},
		onError: () =>
			toast.error(i18n.t('messages.errorUpdating', { ns: 'common' }))
	})
}
