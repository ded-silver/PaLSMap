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

import { NodeService } from '../../model/api'
import type { CustomNode, NodeDto } from '../../model/types'
import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'
import { NodeSettingsDrawer } from '../NodeSettingsDrawer'

import styles from './River.module.css'
import { useIsAdmin } from '@/entities/user'

export const River = ({ data, id }: NodeProps<CustomNode>) => {
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
				type: 'River',
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
				type: 'River',
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
		<div className={styles['nodeName']}>
			<Typography
				sx={{
					position: 'absolute',
					top: 'calc(10% - 55px)',
					left: '50%',
					transform: 'translateX(-50%) rotate(60deg)',
					transformOrigin: 'center',
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

			{isAdmin ? (
				<div
					className={styles['lockButtonWrapper']}
					onClick={e => e.stopPropagation()}
					onMouseDown={e => e.stopPropagation()}
				>
					<IconButton
						onClick={e => {
							e.stopPropagation()
							e.preventDefault()
							handleLockToggle()
						}}
						onMouseDown={e => {
							e.stopPropagation()
							e.preventDefault()
						}}
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
			<div
				onClick={handleClickOpen}
				style={{ transform: 'rotate(60deg)', cursor: 'pointer' }}
			>
				<svg
					width='650'
					height='50'
					viewBox='0 0 650 50'
					xmlns='http://www.w3.org/2000/svg'
					style={{ display: 'block' }}
				>
					<path
						d='M0,25 
         C40,5 80,45 120,25 
         C160,5 200,45 240,25 
         C280,5 320,45 360,25 
         C400,5 440,45 480,25 
         C520,5 560,45 600,25 
         C620,15 640,35 650,25'
						fill='none'
						stroke='rgba(14, 165, 233, 0.7)'
						strokeWidth='8'
						strokeLinecap='round'
					/>
				</svg>
			</div>
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
