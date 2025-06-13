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
import { Handle, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { useDebouncedCallback } from '../../../hooks/useDebouncedCallback'
import { NodeService } from '../../../services/node.service'
import { CustomNode, NodeDto } from '../../../types/nodeTypes'
import { DialogData } from '../TankParkNode/DialogData'

import styles from './OPSNode.module.css'

export const OPSNode = ({ data, id }: NodeProps<CustomNode>) => {
	const [open, setOpen] = useState(false)
	const { getNode } = useReactFlow()
	const [nodeName, setNodeName] = useState<string>(data.label)
	const queryClient = useQueryClient()
	const node = getNode(id)

	const isAdmin = localStorage.getItem('isAdmin')

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
			toast.error('Ошибка при удалении')
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
			toast.error('Не удалось обновить данные')
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
				type: 'OPS',
				position: node?.position,
				data
			})
		}
	}, 500)

	return (
		<div className={styles['nodeName']}>
			<input
				value={nodeName}
				placeholder='Введите имя узла'
				readOnly={isAdmin !== 'true'}
				onChange={e => {
					if (isAdmin === 'true') {
						setNodeName(e.target.value)
						handleChangeNodeName()
					}
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
				{isAdmin === 'true' ? (
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
				<div className={styles['circle']}>
					<div className={styles['cross']} />
				</div>
				{data.handlers.map(h => (
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
					currentNodeType='OPS'
					dialogName={data.label}
					open={open}
					handleClose={handleClose}
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
						Вы уверены, что хотите удалить объект{' '}
						<b>{nodeName || 'без имени'}</b>?
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
						onClick={() => {
							handleDelete()
							setConfirmOpen(false)
						}}
						color='error'
						variant='contained'
					>
						Удалить
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
