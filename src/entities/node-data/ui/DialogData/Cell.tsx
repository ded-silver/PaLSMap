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
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import TableDialog from './TableDialog'
import { NodeDataService } from '@/entities/node-data'
import type { NodeData } from '@/entities/node-data'
import { useIsAdmin } from '@/entities/user'
import { useDialog } from '@/shared/hooks'

interface Props {
	row: NodeData
	nodeId: string
	items: NodeData[]
}

export const Cell: FC<Props> = ({ row, nodeId, items }) => {
	const { t: tNodes } = useTranslation('nodes')
	const { t: tCommon } = useTranslation('common')
	const queryClient = useQueryClient()
	const { isOpen, handleDialogOpen, handleDialogClose } = useDialog()

	const isAdmin = useIsAdmin()
	const [confirmOpen, setConfirmOpen] = useState(false)

	const { mutate: deleteNodeData } = useMutation({
		mutationKey: ['updateNodeData'],
		mutationFn: (id: string) => NodeDataService.deleteNodeData(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['currentNodeData'] })
			toast.success(tNodes('messages.deleteRowSuccess'))
		},
		onError: () => {
			toast.error(tNodes('messages.deleteRowError'))
		}
	})

	const handleDeleteConfirmed = () => {
		deleteNodeData(row.id)
		setConfirmOpen(false)
	}

	return (
		<>
			{isAdmin && (
				<Box
					width='100%'
					display='flex'
					justifyContent='space-around'
					alignItems='center'
				>
					<Tooltip title={tNodes('actions.edit')}>
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
					{/* оно */}
					<Tooltip title={tNodes('actions.delete')}>
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
						<DialogTitle>{tNodes('dialogs.deleteRowTitle')}</DialogTitle>
						<DialogContent>
							<DialogContentText>
								{tNodes('confirmations.deleteRow')}
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={() => setConfirmOpen(false)}
								variant='contained'
							>
								{tCommon('buttons.cancel')}
							</Button>
							<Button
								onClick={handleDeleteConfirmed}
								color='error'
								variant='contained'
							>
								{tCommon('buttons.delete')}
							</Button>
						</DialogActions>
					</Dialog>
				</Box>
			)}
		</>
	)
}
