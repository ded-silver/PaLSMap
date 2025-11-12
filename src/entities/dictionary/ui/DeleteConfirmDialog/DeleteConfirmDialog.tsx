import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography
} from '@mui/material'
import { CircularProgress } from '@mui/material'

import type { IDictionary } from '../../model/types'

import styles from './DeleteConfirmDialog.module.css'

interface DeleteConfirmDialogProps {
	isOpen: boolean
	item: IDictionary
	onClose: () => void
	onConfirm: () => void
	isLoading?: boolean
}

export const DeleteConfirmDialog = ({
	isOpen,
	item,
	onClose,
	onConfirm,
	isLoading
}: DeleteConfirmDialogProps) => {
	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth='sm'
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: '12px'
				}
			}}
		>
			<DialogTitle>
				<Typography sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
					Подтверждение удаления
				</Typography>
			</DialogTitle>

			<DialogContent>
				<DialogContentText>
					Вы уверены, что хотите удалить запись?
				</DialogContentText>
				<div className={styles.itemInfo}>
					<Typography
						variant='body2'
						sx={{ fontWeight: 600, marginBottom: '8px' }}
					>
						Аббревиатура:
					</Typography>
					<Typography
						variant='body1'
						sx={{ marginBottom: '16px' }}
					>
						{item.short}
					</Typography>
					<Typography
						variant='body2'
						sx={{ fontWeight: 600, marginBottom: '8px' }}
					>
						Полное название:
					</Typography>
					<Typography variant='body1'>{item.full}</Typography>
				</div>
			</DialogContent>

			<DialogActions sx={{ padding: '16px 24px' }}>
				<Button
					onClick={onClose}
					disabled={isLoading}
					variant='outlined'
				>
					Отмена
				</Button>
				<Button
					onClick={onConfirm}
					disabled={isLoading}
					variant='contained'
					color='error'
					startIcon={isLoading ? <CircularProgress size={16} /> : null}
				>
					{isLoading ? 'Удаление...' : 'Удалить'}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
