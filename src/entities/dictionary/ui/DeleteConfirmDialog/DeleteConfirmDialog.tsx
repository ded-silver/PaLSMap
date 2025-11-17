import CloseIcon from '@mui/icons-material/Close'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Typography
} from '@mui/material'
import { CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'

import type { IDictionary } from '../../model/types'

import styles from './DeleteConfirmDialog.module.css'
import { MUI_STYLES } from '@/shared/styles/constants'

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
	const { t } = useTranslation(['common', 'dictionary'])

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth='sm'
			fullWidth
			PaperProps={{
				sx: MUI_STYLES.dialogPaper
			}}
		>
			<DialogTitle sx={MUI_STYLES.dialogTitleError}>
				<Typography sx={MUI_STYLES.typography.titleMedium}>
					{t('messages.deleteTitle', { ns: 'dictionary' })}
				</Typography>
				<IconButton
					aria-label='close'
					onClick={onClose}
					sx={MUI_STYLES.iconButtonClosePrimary}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={MUI_STYLES.dialogContent}>
				<DialogContentText sx={{ marginTop: '16px' }}>
					{t('messages.deleteConfirm', { ns: 'dictionary' })}
				</DialogContentText>
				<div className={styles.itemInfo}>
					<Typography
						variant='body2'
						sx={{
							...MUI_STYLES.typography.bodyBold,
							...MUI_STYLES.spacing.mb1
						}}
					>
						{t('messages.abbreviation', { ns: 'dictionary' })}
					</Typography>
					<Typography
						variant='body1'
						sx={MUI_STYLES.spacing.mb2px}
					>
						{item.short}
					</Typography>
					<Typography
						variant='body2'
						sx={{
							...MUI_STYLES.typography.bodyBold,
							...MUI_STYLES.spacing.mb1
						}}
					>
						{t('messages.fullName', { ns: 'dictionary' })}
					</Typography>
					<Typography variant='body1'>{item.full}</Typography>
				</div>
			</DialogContent>

			<DialogActions sx={MUI_STYLES.dialogActions}>
				<Button
					onClick={onClose}
					disabled={isLoading}
					variant='outlined'
				>
					{t('buttons.cancel', { ns: 'common' })}
				</Button>
				<Button
					onClick={onConfirm}
					disabled={isLoading}
					variant='contained'
					color='error'
					startIcon={isLoading ? <CircularProgress size={16} /> : null}
				>
					{isLoading
						? t('messages.deleting', { ns: 'common' })
						: t('buttons.delete', { ns: 'common' })}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
