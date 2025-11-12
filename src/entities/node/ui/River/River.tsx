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
import { NodeProps, useReactFlow } from '@xyflow/react'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { NodeService } from '../../model/api'
import type { CustomNode, NodeDto } from '../../model/types'

import styles from './River.module.css'
import { useDebouncedCallback } from '@/shared/hooks'

export const River = ({ data, id }: NodeProps<CustomNode>) => {
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
				type: 'River',
				position: node?.position,
				data
			})
		}
	}, 500)

	return (
		<div className={styles['nodeName']}>
			<input
				value={nodeName}
				placeholder='Введите название реки'
				readOnly={isAdmin !== 'true'}
				onChange={e => {
					if (isAdmin === 'true') {
						setNodeName(e.target.value)
						handleChangeNodeName()
					}
				}}
				style={{
					backgroundColor: 'transparent',
					top: 'calc(10% - 25px)',
					border: 'none',
					outline: 'none',
					color: 'inherit',
					textAlign: 'center',
					transform: 'rotate(60deg)',
					transformOrigin: 'center',
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
