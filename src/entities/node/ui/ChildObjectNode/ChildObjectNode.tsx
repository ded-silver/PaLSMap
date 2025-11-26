import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NodeProps, useReactFlow } from '@xyflow/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { NodeSettingsDrawer } from '../NodeSettingsDrawer'

import styles from './ChildObjectNode.module.css'
import { type CustomNode, type NodeDto, NodeService } from '@/entities/node'
import { DialogData, NodeDataService } from '@/entities/node-data'
import { useIsAdmin } from '@/entities/user'

export const ChildObjectNode = ({
	data,
	id,
	parentId
}: NodeProps<CustomNode>) => {
	const { t } = useTranslation(['common', 'nodes'])
	const [open, setOpen] = useState(false)
	const { getNode, setNodes } = useReactFlow()
	const queryClient = useQueryClient()
	const [nodeName, setNodeName] = useState<string>(data.label)
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [editingName, setEditingName] = useState<string>(data.label)
	const [isLocked, setIsLocked] = useState<boolean>(data.locked ?? false)
	const [initialLocked, setInitialLocked] = useState<boolean>(
		data.locked ?? false
	)
	const node = getNode(id)

	useEffect(() => {
		if (drawerOpen) {
			setInitialLocked(data.locked ?? false)
		}
	}, [drawerOpen, data.locked])

	const isAdmin = useIsAdmin()

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
				parentId,
				locked: isLocked
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

	const { mutate: updateLockStatus, isPending: isLocking } = useMutation({
		mutationKey: ['updateLockStatus'],
		mutationFn: (locked: boolean) => {
			if (!node?.position) throw new Error('Node position not found')
			return NodeService.update(id, {
				...node,
				id,
				type: 'ChildObject',
				position: node.position,
				data,
				parentId,
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
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
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
				type: 'ChildObject',
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
		<div
			className={styles['nodeName']}
			style={{ position: 'relative' }}
		>
			<Typography
				sx={{
					position: 'absolute',
					top: '30%',
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
