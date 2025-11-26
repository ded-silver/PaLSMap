import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Handle, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'
import { NodeSettingsDrawer } from '../NodeSettingsDrawer'

import styles from './CheckpointNode.module.css'
import {
	type CustomNode,
	type NodeDto,
	type NodeHandlers,
	NodeService
} from '@/entities/node'
import { DialogData } from '@/entities/node-data'
import { useIsAdmin } from '@/entities/user'

export const CheckpointNode = ({ data, id }: NodeProps<CustomNode>) => {
	const { t } = useTranslation(['common', 'nodes'])
	const [open, setOpen] = useState(false)
	const { getNode } = useReactFlow()
	const [nodeName, setNodeName] = useState<string>(data.label)
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [editingName, setEditingName] = useState<string>(data.label)
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

	const { mutate: updateCurrentNode, isPending: isSaving } = useMutation({
		mutationKey: ['updateCurrentNode'],
		mutationFn: (data: NodeDto) =>
			NodeService.update(data.id, {
				...data,
				data: {
					...data.data,
					label: editingName
				}
			}),
		onSuccess: data => {
			setNodeName(editingName)
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
			setDrawerOpen(false)
		},
		onError: error => {
			toast.error(t('messages.updateDataError', { ns: 'nodes' }))
		}
	})

	const handleDelete = () => {
		deleteNode(id)
	}

	const handleSaveName = () => {
		if (node?.position && editingName !== nodeName) {
			updateCurrentNode({
				...node,
				id,
				type: 'Checkpoint',
				position: node?.position,
				data
			})
		}
	}

	return (
		<div className={styles['nodeName']}>
			<Typography
				sx={{
					backgroundColor: 'transparent',
					color: 'inherit',
					textAlign: 'center',
					fontSize: '30px',
					whiteSpace: 'nowrap'
				}}
			>
				{nodeName}
			</Typography>
			{isAdmin ? (
				<div
					className={styles['settingsButtonWrapper']}
					onClick={e => e.stopPropagation()}
				>
					<IconButton
						onClick={() => {
							setEditingName(nodeName)
							setDrawerOpen(true)
						}}
					>
						<SettingsIcon fontSize='small' />
					</IconButton>
				</div>
			) : null}
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

			<NodeSettingsDrawer
				open={drawerOpen}
				onClose={() => {
					setEditingName(nodeName)
					setDrawerOpen(false)
				}}
				nodeName={nodeName}
				editingName={editingName}
				onEditingNameChange={setEditingName}
				onSave={handleSaveName}
				isAdmin={isAdmin}
				isSaving={isSaving}
			/>
		</div>
	)
}
