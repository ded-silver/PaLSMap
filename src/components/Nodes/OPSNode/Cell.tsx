import { Delete } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { toast } from 'react-toastify'

import { useDialog } from '../../../hooks/useDialog'
import { NodeService } from '../../../services/node.service'
import { NodeData } from '../../../types/nodeTypes'

import TableDialog from './TableDialog'

interface Props {
	row: NodeData
	nodeId: string
	items: NodeData[]
}

export const Cell: FC<Props> = ({ row, nodeId, items }) => {
	const queryClient = useQueryClient()
	const { isOpen, handleDialogOpen, handleDialogClose } = useDialog()

	
	const isAdmin = localStorage.getItem('isAdmin')

	const { mutate: deleteNodeData } = useMutation({
		mutationKey: ['updateNodeData'],
		mutationFn: (id: string) => NodeService.deleteNodeData(id),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['currentNodeData'] })
		},
		onError: error => {
			toast.error('Login or registration failed.')
		}
	})

	return (
		<>
			{isAdmin === 'true' ? (
				<Box
					width='100%'
					display='flex'
					justifyContent='space-around'
					alignItems='center'
				>
					<Tooltip title='Редактировать'>
						<IconButton
							size='large'
							onClick={() => {
								handleDialogOpen()
							}}
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
							onClick={() => {
								deleteNodeData(row.id)
							}}
						>
							<Delete
								fontSize='small'
								color='secondary'
							/>
						</IconButton>
					</Tooltip>
					{isOpen && row ? (
						<TableDialog
							items={items}
							nodeId={nodeId}
							isDetails
							row={row}
							open={isOpen}
							handleClose={handleDialogClose}
						/>
					) : null}
				</Box>
			) : null}
		</>
	)
}
