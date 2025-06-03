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
import { DialogData } from '../DialogData'

import styles from './ChildObjectNode.module.css'

export const ChildObjectNode = ({
	data,
	id,
	parentId
}: NodeProps<CustomNode>) => {
	const [open, setOpen] = useState(false)
	const { getNode } = useReactFlow()
	const queryClient = useQueryClient()
	const [nodeName, setNodeName] = useState<string>(data.label)
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
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
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
				},
				parentId
			}),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
		},
		onError: error => {
			toast.error('Не удалось обновить данные')
		}
	})

	const handleDelete = () => {
		deleteNode(id)
	}

	const handleChangeNodeName = useDebouncedCallback((text: string) => {
		if (node?.position) {
			updateCurrentNode({
				id,
				type: 'ChildObject',
				position: node?.position,
				data
			})
		}
	}, 500)

	return (
		<div
			className={styles['nodeName']}
			style={{ position: 'relative' }}
		>
			<input
				value={nodeName}
				placeholder='Введите имя узла'
				onChange={e => {
					setNodeName(e.target.value)
					handleChangeNodeName(e.target.value)
				}}
				style={{
					position: 'absolute',
					top: '30%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					backgroundColor: 'transparent',
					border: 'none',
					outline: 'none',
					color: 'inherit',
					textAlign: 'center',
					fontSize: '15px',
					pointerEvents: 'auto',
					zIndex: '1003'
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
				className={styles['container']}
				onClick={handleClickOpen}
			>
				<div className={styles['cube']} />
				{data.handlers.map(h => (
					<div key={nanoid()}>
						<Handle
							type={h.type}
							id={h.id}
							position={h.type === 'source' ? Position.Top : Position.Bottom}
						/>
					</div>
				))}
			</div>
			{open ? (
				<DialogData
					open={open}
					handleClose={handleClose}
					id={id}
					dialogName={data.label}
				/>
			) : null}
		</div>
	)
}
