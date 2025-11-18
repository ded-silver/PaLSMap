import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { IconButton } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	NodeResizer,
	ResizeDragEvent,
	ResizeParams,
	useReactFlow
} from '@xyflow/react'
import clsx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { NodeService } from '../../model/api'
import type { CustomData, NodeDto } from '../../model/types'
import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'

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
			toast.error(t('messages.updateDataError', { ns: 'nodes' }))
		}
	})

	const handleChangeNodeName = useDebouncedCallback((text: string) => {
		if (node?.position) {
			updateCurrentNode({
				...node,
				id,
				type: variant,
				position: node?.position,
				measured: node.measured,
				data: node.data as unknown as CustomData
			})
		}
	}, 500)

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

	return (
		<>
			{isName ? (
				<input
					className='node-name'
					value={nodeName}
					placeholder={t('placeholders.name', { ns: 'nodes' })}
					readOnly={!isAdmin}
					onClick={e => e.stopPropagation()}
					onChange={e => {
						if (isAdmin) {
							setNodeName(e.target.value)
							handleChangeNodeName()
						}
					}}
				/>
			) : null}
			<div
				className={clsx(styles.node, styles[variant])}
				onClick={handleClickOpen}
			>
				{isAdmin ? (
					<IconButton
						onClick={e => {
							e.stopPropagation()
							setConfirmOpen(true)
						}}
					>
						<DeleteOutlineIcon fontSize='small' />
					</IconButton>
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
		</>
	)
}
