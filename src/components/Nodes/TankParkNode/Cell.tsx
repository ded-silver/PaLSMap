import { Delete } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { toast } from 'react-toastify'

import { TableDialog } from '@/entities/node-data'
import { NodeDataService } from '@/entities/node-data'
import type { NodeData } from '@/entities/node-data'
import { useDialog } from '@/shared/hooks'

interface Props {
	row: NodeData
	nodeId: string
	items: NodeData[]
}

export const Cell: FC<Props> = ({ row, nodeId, items }) => {
	const queryClient = useQueryClient()
	const { isOpen, handleDialogOpen, handleDialogClose } = useDialog()

	const isAdmin = localStorage.getItem('isAdmin')
	const [confirmOpen, setConfirmOpen] = useState(false) // новое состояние

	const { mutate: deleteNodeData } = useMutation({
		mutationKey: ['updateNodeData'],
		mutationFn: (id: string) => NodeDataService.deleteNodeData(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['currentNodeData'] })
			toast.success('Строка успешно удалена.')
		},
		onError: () => {
			toast.error('Ошибка при удалении строки.')
		}
	})

	const handleDeleteConfirmed = () => {
		deleteNodeData(row.id)
		setConfirmOpen(false)
	}

	return (
		<>
			{isAdmin === 'true' && (
				<Box
					width='100%'
					display='flex'
					justifyContent='space-around'
					alignItems='center'
				>
					<Tooltip title='Редактировать'>
						<IconButton
							size='large'
							onClick={handleDialogOpen}
						>
							<EditIcon
								fontSize='small'
								color='secondary'
							/>
						</IconButton>
					</Tooltip>

					<Tooltip title='Удалить'>
						<IconButton
							size='large'
							onClick={() => setConfirmOpen(true)}
						>
							<Delete
								fontSize='small'
								color='secondary'
							/>
						</IconButton>
					</Tooltip>

					<TableDialog
						items={items}
						nodeId={nodeId}
						isDetails
						row={row}
						open={isOpen}
						handleClose={handleDialogClose}
					/>

					<Dialog
						open={confirmOpen}
						onClose={() => setConfirmOpen(false)}
					>
						<DialogTitle>Подтвердите удаление</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Вы уверены, что хотите удалить эту строку?
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
								onClick={handleDeleteConfirmed}
								color='error'
								variant='contained'
							>
								Удалить
							</Button>
						</DialogActions>
					</Dialog>
				</Box>
			)}
		</>
	)
}
