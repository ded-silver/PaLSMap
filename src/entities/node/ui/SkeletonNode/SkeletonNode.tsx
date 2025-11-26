import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	NodeResizer,
	ResizeDragEvent,
	ResizeParams,
	useReactFlow
} from '@xyflow/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { NodeService } from '../../model/api'
import type { CustomData, NodeDto } from '../../model/types'
import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'
import { NodeSettingsDrawer } from '../NodeSettingsDrawer'

import styles from './SkeletonNode.module.css'
import { DialogData } from '@/entities/node-data'
import { NodeDataService } from '@/entities/node-data'
import { useIsAdmin } from '@/entities/user'
import { useDebouncedCallback } from '@/shared/hooks'

interface Props {
	id: string
	width?: number
	height?: number
	variant:
		| 'OPS'
		| 'TankPark'
		| 'Checkpoint'
		| 'Valve'
		| 'Pump'
		| 'AccountingSystem'
		| 'ChildTankPark'
		| 'PNS'
		| 'MNS'
		| 'SAR'
		| 'FGU'
		| 'KPPSOD'
		| 'Capacity'
		| 'River'
		| 'Factory'
		| 'Object'
		| 'ParentObject'
		| 'ChildObject'
	isName?: boolean
	name?: string
	parentId?: string
	isData?: boolean
	locked?: boolean
}

export const SkeletonNode = ({
	id,
	width,
	height,
	variant,
	name,
	parentId,
	isName,
	isData,
	locked: initialLocked = false
}: Props) => {
	const { t } = useTranslation(['common', 'nodes'])
	const { getNode, setNodes } = useReactFlow()
	const [open, setOpen] = useState(false)

	const [nodeName, setNodeName] = useState<string>(name ?? '')
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [editingName, setEditingName] = useState<string>(name ?? '')
	const [isLocked, setIsLocked] = useState<boolean>(initialLocked)
	const [initialLockedState, setInitialLockedState] =
		useState<boolean>(initialLocked)
	const node = getNode(id)

	useEffect(() => {
		setIsLocked(initialLocked)
	}, [initialLocked])

	useEffect(() => {
		if (drawerOpen) {
			setInitialLockedState(initialLocked)
		}
	}, [drawerOpen, initialLocked])

	const queryClient = useQueryClient()

	const isAdmin = useIsAdmin()

	const [confirmOpen, setConfirmOpen] = useState(false)

	useEffect(() => {
		setIsLocked(initialLocked)
	}, [initialLocked])

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

	const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation()
		deleteNode(id)
	}

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
				type: variant,
				position: node.position,
				measured: node.measured,
				data: node.data as unknown as CustomData,
				parentId,
				locked
			})
		},
		onSuccess: (_, locked) => {
			setIsLocked(locked)
			setInitialLockedState(locked)
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

	const handleSaveName = () => {
		if (node?.position && editingName !== nodeName) {
			updateCurrentNode({
				...node,
				id,
				type: variant,
				position: node?.position,
				measured: node.measured,
				data: node.data as unknown as CustomData,
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
		const lockChanged = newLocked !== initialLockedState

		if (lockChanged) {
			updateLockStatus(newLocked)
			setInitialLockedState(newLocked)
		}

		if (nameChanged) {
			setEditingName(newName)
			handleSaveName()
		}
	}

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

	const handleChangeNodeSize = useDebouncedCallback(
		(event: ResizeDragEvent, params: ResizeParams) => {
			const { width, height } = params
			if (node?.position) {
				updateCurrentNode({
					...node,
					id,
					type: variant,
					position: node?.position,
					measured: {
						width,
						height
					},
					data: node.data as unknown as CustomData,
					locked: isLocked
				})
			}
		},
		500
	)

	useEffect(() => {
		setNodeName(name ?? '')
		setEditingName(name ?? '')
	}, [name])

	return (
		<>
			{isName ? (
				<Typography
					className={styles.nodeName}
					sx={{ fontSize: '22px', fontFamily: 'inherit' }}
				>
					{nodeName}
				</Typography>
			) : null}
			<div
				className={clsx(styles.node, styles[variant])}
				onClick={handleClickOpen}
			>
				{isAdmin && isName ? (
					<div
						className={styles.settingsButtonWrapper}
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

				{isAdmin && isName ? (
					<div
						className={styles.lockButtonWrapper}
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

				{isAdmin ? (
					<div
						className={styles.deleteButtonWrapper}
						onClick={e => e.stopPropagation()}
					>
						<IconButton
							onClick={e => {
								e.stopPropagation()
								setConfirmOpen(true)
							}}
						>
							<DeleteOutlineIcon fontSize='small' />
						</IconButton>
					</div>
				) : null}
			</div>
			{isAdmin && width && height ? (
				<NodeResizer
					minWidth={width}
					minHeight={height}
					maxHeight={12200}
					maxWidth={12200}
					onResize={(event, params) => handleChangeNodeSize(event, params)}
				/>
			) : null}
			{open && isData ? (
				<DialogData
					open={open}
					handleClose={handleClose}
					dialogName={name ?? t('labels.nameNotSet', { ns: 'nodes' })}
					id={id}
				/>
			) : null}

			<DeleteNodeConfirmDialog
				isOpen={confirmOpen}
				nodeName={name ?? t('labels.withoutName', { ns: 'nodes' })}
				onClose={() => setConfirmOpen(false)}
				onConfirm={() => {
					handleDelete({} as any)
					setConfirmOpen(false)
				}}
			/>

			{isName ? (
				<NodeSettingsDrawer
					open={drawerOpen}
					onClose={() => {
						setEditingName(nodeName)
						setIsLocked(initialLockedState)
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
			) : null}
		</>
	)
}
