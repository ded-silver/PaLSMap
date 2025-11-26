import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
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
}

export const SkeletonNode = ({
	id,
	width,
	height,
	variant,
	name,
	parentId,
	isName,
	isData
}: Props) => {
	const { t } = useTranslation(['common', 'nodes'])
	const { getNode } = useReactFlow()
	const [open, setOpen] = useState(false)

	const [nodeName, setNodeName] = useState<string>(name ?? '')
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [editingName, setEditingName] = useState<string>(name ?? '')
	const node = getNode(id)

	const queryClient = useQueryClient()

	const isAdmin = useIsAdmin()

	const [confirmOpen, setConfirmOpen] = useState(false)

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

	const handleSaveName = () => {
		if (node?.position && editingName !== nodeName) {
			updateCurrentNode({
				...node,
				id,
				type: variant,
				position: node?.position,
				measured: node.measured,
				data: node.data as unknown as CustomData
			})
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
					data: node.data as unknown as CustomData
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
						setDrawerOpen(false)
					}}
					nodeName={nodeName}
					editingName={editingName}
					onEditingNameChange={setEditingName}
					onSave={handleSaveName}
					isAdmin={isAdmin}
					isSaving={isSaving}
				/>
			) : null}
		</>
	)
}
