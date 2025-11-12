import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { IconButton } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NodeProps, useReactFlow } from '@xyflow/react'
import { useState } from 'react'
import { toast } from 'react-toastify'

import styles from './ChildObjectNode.module.css'
import { type CustomNode, type NodeDto, NodeService } from '@/entities/node'
import { DialogData, NodeDataService } from '@/entities/node-data'
import { useDebouncedCallback } from '@/shared/hooks'

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

	const isAdmin = localStorage.getItem('isAdmin')

	const handleClickOpen = () => {
		setOpen(true)
	}

	const { mutate: invalidateParentData } = useMutation({
		mutationKey: ['invalidateParentData'],
		mutationFn: (parentId: string) => NodeDataService.getNodeData(parentId),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['currentNodeData'] })
		},
		onError(error: unknown) {
			toast.error('Ошибка при удалении')
		}
	})

	const handleClose = () => {
		if (parentId) {
			invalidateParentData(parentId)
		}
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
				...node,
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
				placeholder='Название'
				readOnly={isAdmin !== 'true'}
				onChange={e => {
					if (isAdmin === 'true') {
						setNodeName(e.target.value)
						handleChangeNodeName()
					}
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
					fontSize: '22px',
					pointerEvents: 'auto',
					zIndex: '1003'
				}}
			/>
			<div
				className={styles['deleteButtonWrapper']}
				onClick={e => e.stopPropagation()}
			>
				{isAdmin === 'true' ? (
					<IconButton onClick={handleDelete}>
						<DeleteOutlineIcon fontSize='small' />
					</IconButton>
				) : null}
			</div>
			<div
				className={styles['container']}
				onClick={handleClickOpen}
			>
				<div className={styles['cube']} />
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
