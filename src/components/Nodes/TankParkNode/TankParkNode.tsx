import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { IconButton } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Handle, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { useDebouncedCallback } from '../../../hooks/useDebouncedCallback'
import { NodeDto, NodeService } from '../../../services/node.service'
import { CustomNode } from '../../../types/nodeTypes'
import styles from './TankParkNode.module.css'
import { DialogData } from './DialogData'

export const TankParkNode = ({ data, id }: NodeProps<CustomNode>) => {
	const [open, setOpen] = useState(false)
	const { getNode } = useReactFlow()
	const [nodeName, setNodeName] = useState<string>(data.label)
	const queryClient = useQueryClient()
	const node = getNode(id)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const { mutate: deleteNode } = useMutation({
		mutationKey: ['deleteNode'],
		mutationFn: (nodeId: string) => NodeService.delete(nodeId),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
		},
		onError(error: unknown) {
			toast.error('Ошибка при удалении')
		}
	})

	const { mutate: updateCurrentNode } = useMutation({
		mutationKey: ['updateCurrentNode'],
		mutationFn: (data: NodeDto) =>
			NodeService.update(data.id, {
				...data,
				data: {
					...data.data,
					label: nodeName
				}
			}),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
		},
		onError: error => {
			toast.error('Не удалось обновить данные')
		}
	})

	const handleDelete = () => {
		deleteNode(id)
	}

	const handleChangeNodeName = useDebouncedCallback(() => {
		if (node?.position) {
			updateCurrentNode({
				id,
				type: 'TankPark',
				position: node?.position,
				data
			})
		}
	}, 500)

	return (
		<div className={styles['nodeName']}>
			<input
				value={nodeName}
				placeholder='Введите имя узла'
				onChange={e => {
					setNodeName(e.target.value)
					handleChangeNodeName()
				}}
				style={{
					backgroundColor: 'transparent',
					border: 'none',
					outline: 'none',
					color: 'inherit',
					textAlign: 'center'
				}}
			/>
			<div
				className={styles['deleteButtonWrapper']}
				onClick={e => e.stopPropagation()}
			>
				<IconButton onClick={handleDelete}>
					<DeleteOutlineIcon fontSize='small' />
				</IconButton>
			</div>
			<div
				className={styles['circle-container']}
				onClick={handleClickOpen}
			>
				<div className={styles['chart-cylinder']} />
				{data.handlers.map(h => (
					<div key={nanoid()}>
						<Handle
							type={h.type}
							id={h.id}
							position={h.type === 'source' ? Position.Right : Position.Left}
						/>
					</div>
				))}
			</div>

			{open ? (
				<DialogData
					dialogName={data.label}
					open={open}
					handleClose={handleClose}
					id={id}
				/>
			) : null}
		</div>
	)
}
