import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NodeProps, useReactFlow } from '@xyflow/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'
import { NodeSettingsDrawer } from '../NodeSettingsDrawer'

import styles from './ValveNode.module.css'
import { type CustomNode, type NodeDto, NodeService } from '@/entities/node'
import { DialogData, NodeDataService } from '@/entities/node-data'
import { useIsAdmin } from '@/entities/user'

export const ValveNode = ({ data, id, parentId }: NodeProps<CustomNode>) => {
	const { t } = useTranslation(['common', 'nodes'])
	const [open, setOpen] = useState(false)
	const { getNode } = useReactFlow()
	const queryClient = useQueryClient()
	const [nodeName, setNodeName] = useState<string>(data.label)
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [editingName, setEditingName] = useState<string>(data.label)
	const node = getNode(id)

	const isAdmin = useIsAdmin()

	const [confirmOpen, setConfirmOpen] = useState(false)

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
			toast.error(t('messages.deleteError', { ns: 'nodes' }))
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
				},
				parentId
			}),
		onSuccess: data => {
			setNodeName(editingName)
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
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
				type: 'Valve',
				position: node?.position,
				data
			})
		}
	}

	return (
		<div
			className={styles['nodeName']}
			style={{ position: 'relative' }}
		>
			<Typography
				sx={{
					position: 'absolute',
					top: 'calc(10% - 25px)',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					color: 'inherit',
					textAlign: 'center',
					fontSize: '22px',
					zIndex: '1003',
					whiteSpace: 'nowrap'
				}}
			>
				{nodeName}
			</Typography>
			{isAdmin ? (
				<div
					className={styles['settingsButtonWrapper']}
					onClick={e => e.stopPropagation()}
					onMouseDown={e => e.stopPropagation()}
				>
					<IconButton
						onClick={e => {
							e.stopPropagation()
							e.preventDefault()
							setEditingName(nodeName)
							setDrawerOpen(true)
						}}
						onMouseDown={e => {
							e.stopPropagation()
							e.preventDefault()
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
				className={styles['container']}
				onClick={handleClickOpen}
			>
				<div className={styles['triangle-left']} />
				<div className={styles['triangle-right']} />

				<div className={styles['cube']} />
			</div>

			{open ? (
				<DialogData
					open={open}
					handleClose={handleClose}
					dialogName={data.label}
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
