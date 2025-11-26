import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Handle, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'
import { NodeSettingsDrawer } from '../NodeSettingsDrawer'

import styles from './OPSNode.module.css'
import {
	type CustomNode,
	type NodeDto,
	type NodeHandlers,
	NodeService
} from '@/entities/node'
import { DialogData } from '@/entities/node-data'
import { useIsAdmin } from '@/entities/user'

export const OPSNode = ({ data, id }: NodeProps<CustomNode>) => {
	const { t } = useTranslation(['common', 'nodes'])
	const [open, setOpen] = useState(false)
	const { getNode, setNodes } = useReactFlow()
	const [nodeName, setNodeName] = useState<string>(data.label)
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [editingName, setEditingName] = useState<string>(data.label)
	const [isLocked, setIsLocked] = useState<boolean>(data.locked ?? false)
	const [initialLocked, setInitialLocked] = useState<boolean>(
		data.locked ?? false
	)
	const queryClient = useQueryClient()
	const node = getNode(id)

	useEffect(() => {
		if (drawerOpen) {
			setInitialLocked(data.locked ?? false)
		}
	}, [drawerOpen, data.locked])

	const isAdmin = useIsAdmin()

	const [confirmOpen, setConfirmOpen] = useState(false)

	useEffect(() => {
		if (node && isAdmin) {
			const shouldBeDraggable = !isLocked
			if (node.draggable !== shouldBeDraggable) {
				setNodes(nodes =>
					nodes.map(n =>
						n.id === id ? { ...n, draggable: shouldBeDraggable } : n
					)
				)
			}
		}
	}, [isLocked, isAdmin, node, id, setNodes])

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
				},
				locked: isLocked
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

	const { mutate: updateLockStatus, isPending: isLocking } = useMutation({
		mutationKey: ['updateLockStatus'],
		mutationFn: (locked: boolean) => {
			if (!node?.position) throw new Error('Node position not found')
			return NodeService.update(id, {
				...node,
				id,
				type: 'OPS',
				position: node.position,
				data,
				locked
			})
		},
		onSuccess: (_, locked) => {
			setIsLocked(locked)
			setInitialLocked(locked)
			if (isAdmin) {
				setNodes(nodes =>
					nodes.map(n => (n.id === id ? { ...n, draggable: !locked } : n))
				)
			}
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
		},
		onError: error => {
			toast.error(t('messages.updateDataError', { ns: 'nodes' }))
		}
	})

	const handleLockToggle = () => {
		updateLockStatus(!isLocked)
	}

	const handleDelete = () => {
		deleteNode(id)
	}

	const handleSaveName = () => {
		if (node?.position && editingName !== nodeName) {
			updateCurrentNode({
				...node,
				id,
				type: 'OPS',
				position: node?.position,
				data,
				locked: isLocked
			})
		}
	}

	const handleLockChange = (locked: boolean) => {
		setIsLocked(locked)
	}

	const handleSaveFromDrawer = (newName: string, newLocked: boolean) => {
		if (!node?.position) return

		const nameChanged = newName !== nodeName
		const lockChanged = newLocked !== initialLocked

		if (lockChanged) {
			updateLockStatus(newLocked)
			setInitialLocked(newLocked)
		}

		if (nameChanged) {
			setEditingName(newName)
			handleSaveName()
		}
	}

	return (
		<div className={styles['nodeWrapper']}>
			<div
				className={styles['circle-container']}
				onClick={handleClickOpen}
			>
				<div className={styles['circle']}>
					<div className={styles['cross']} />
				</div>
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

			<Typography
				className={styles['nodeName']}
				sx={{
					fontSize: '30px',
					fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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

			{isAdmin ? (
				<div
					className={styles['lockButtonWrapper']}
					onClick={e => e.stopPropagation()}
				>
					<IconButton
						onClick={handleLockToggle}
						disabled={isLocking}
						title={
							isLocked
								? t('labels.unlock', { ns: 'nodes' })
								: t('labels.lock', { ns: 'nodes' })
						}
					>
						{isLocked ? (
							<LockIcon fontSize='small' />
						) : (
							<LockOpenIcon fontSize='small' />
						)}
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

			{open ? (
				<DialogData
					currentNodeType='OPS'
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
					setIsLocked(initialLocked)
					setDrawerOpen(false)
				}}
				nodeName={nodeName}
				editingName={editingName}
				onEditingNameChange={setEditingName}
				onSave={handleSaveFromDrawer}
				isAdmin={isAdmin}
				isSaving={isSaving}
				isLocked={isLocked}
				onLockChange={handleLockChange}
			/>
		</div>
	)
}
