import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	NodeResizer,
	ResizeDragEvent,
	ResizeParams,
	useReactFlow
} from '@xyflow/react'
import clsx from 'clsx'
import { useState } from 'react'
import { toast } from 'react-toastify'

import styles from './SkeletonNode.module.css'
import { NodeService } from '../../model/api'
import type { CustomData, NodeDto } from '../../model/types'
import { DialogData } from '@/entities/node-data'
import { NodeDataService } from '@/entities/node-data'
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
	const { getNode } = useReactFlow()
	const [open, setOpen] = useState(false)

	const [nodeName, setNodeName] = useState<string>(name ?? '')
	const node = getNode(id)

	const queryClient = useQueryClient()

	const isAdmin = localStorage.getItem('isAdmin')

	const [confirmOpen, setConfirmOpen] = useState(false)

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
			toast.error('Не удалось обновить данные')
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
			toast.error('Ошибка при удалении')
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
					placeholder='Название'
					readOnly={isAdmin !== 'true'}
					onClick={e => e.stopPropagation()}
					onChange={e => {
						if (isAdmin === 'true') {
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
				{isAdmin === 'true' ? (
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
			{isAdmin === 'true' && width && height ? (
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
					dialogName={name ?? 'Имя не задано'}
					id={id}
				/>
			) : null}

			<Dialog
				open={confirmOpen}
				onClose={() => setConfirmOpen(false)}
			>
				<DialogTitle>Подтверждение удаления</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Вы уверены, что хотите удалить объект <b>{name ?? 'без имени'}</b>?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setConfirmOpen(false)}
						variant='contained'
					>
						Отмена
					</Button>
					<Button
						onClick={e => {
							handleDelete(e as any)
							setConfirmOpen(false)
						}}
						color='error'
						variant='contained'
					>
						Удалить
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
