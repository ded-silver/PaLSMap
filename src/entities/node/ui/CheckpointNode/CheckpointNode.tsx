import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { IconButton } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Handle, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'

import styles from './CheckpointNode.module.css'
import {
	type CustomNode,
	type NodeDto,
	type NodeHandlers,
	NodeService
} from '@/entities/node'
import { DialogData } from '@/entities/node-data'
import { useIsAdmin } from '@/entities/user'
import { useDebouncedCallback } from '@/shared/hooks'

export const CheckpointNode = ({ data, id }: NodeProps<CustomNode>) => {
	const { t } = useTranslation(['common', 'nodes'])
	const [open, setOpen] = useState(false)
	const { getNode } = useReactFlow()
	const [nodeName, setNodeName] = useState<string>(data.label)
	const queryClient = useQueryClient()
	const node = getNode(id)

	const isAdmin = useIsAdmin()

	const [confirmOpen, setConfirmOpen] = useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		queryClient.invalidateQueries({ queryKey: ['currentNodeData'] })
		setOpen(false)
	}

	const { mutate: deleteNode } = useMutation({
		mutationKey: ['deleteNode'],
		mutationFn: (nodeId: string) => NodeService.delete(nodeId),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
		},
		onError(error: unknown) {
			toast.error(t('messages.deleteError', { ns: 'nodes' }))
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
			toast.error(t('messages.updateDataError', { ns: 'nodes' }))
		}
	})

	const handleDelete = () => {
		deleteNode(id)
	}

	const handleChangeNodeName = useDebouncedCallback(() => {
		if (node?.position) {
			updateCurrentNode({
				...node,
				id,
				type: 'Checkpoint',
				position: node?.position,
				data
			})
		}
	}, 500)

	return (
		<div className={styles['nodeName']}>
			<input
				value={nodeName}
				placeholder={t('placeholders.nodeName', { ns: 'nodes' })}
				onChange={e => {
					setNodeName(e.target.value)
					handleChangeNodeName()
				}}
				style={{
					backgroundColor: 'transparent',
					border: 'none',
					outline: 'none',
					color: 'inherit',
					textAlign: 'center',
					fontSize: '30px'
				}}
			/>
			<div
				className={styles['deleteButtonWrapper']}
				onClick={e => e.stopPropagation()}
			>
				{isAdmin ? (
					<IconButton
						onClick={() => {
							setConfirmOpen(true)
						}}
					>
						<DeleteOutlineIcon fontSize='small' />
					</IconButton>
				) : null}
			</div>
			<div
				className={styles['circle-container']}
				onClick={handleClickOpen}
			>
				<div className={styles['circle']} />
				{data.handlers.map((h: NodeHandlers) => (
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
					currentNodeType='Checkpoint'
					dialogName={data.label}
					open={open}
					handleClose={handleClose}
					id={id}
				/>
			) : null}

			<DeleteNodeConfirmDialog
				isOpen={confirmOpen}
				nodeName={nodeName || t('labels.withoutName', { ns: 'nodes' })}
				onClose={() => setConfirmOpen(false)}
				onConfirm={() => {
					handleDelete()
					setConfirmOpen(false)
				}}
			/>
		</div>
	)
}
