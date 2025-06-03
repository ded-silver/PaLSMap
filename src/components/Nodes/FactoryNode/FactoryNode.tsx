import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { IconButton } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NodeProps } from '@xyflow/react'
import { toast } from 'react-toastify'

import { NodeService } from '../../../services/node.service'
import { CustomNode } from '../../../types/nodeTypes'

import styles from './FactoryNode.module.css'

export const FactoryNode = ({ data, id }: NodeProps<CustomNode>) => {
	const queryClient = useQueryClient()

	const { mutate: deleteNode } = useMutation({
		mutationKey: ['deleteNode'],
		mutationFn: (nodeId: string) => NodeService.delete(nodeId),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
		},
		onError(error: unknown) {
			toast.error('Ошибка при удалении')
		}
	})

	const handleDelete = () => {
		deleteNode(id)
	}

	return (
		<div className={styles['nodeName']}>
			<div
				className={styles['deleteButtonWrapper']}
				onClick={e => e.stopPropagation()}
			>
				<IconButton onClick={handleDelete}>
					<DeleteOutlineIcon fontSize='small' />
				</IconButton>
			</div>
		</div>
	)
}
