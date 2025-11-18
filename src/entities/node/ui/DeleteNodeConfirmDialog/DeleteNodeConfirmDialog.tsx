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

import { MUI_STYLES } from '@/shared/styles/constants'

interface DeleteNodeConfirmDialogProps {
	isOpen: boolean
	nodeName: string
	onClose: () => void
	onConfirm: () => void
	isLoading?: boolean
}

export const DeleteNodeConfirmDialog = ({
	isOpen,
	nodeName,
	onClose,
	onConfirm,
	isLoading
}: DeleteNodeConfirmDialogProps) => {
	const { t } = useTranslation(['common', 'nodes'])

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
					{t('dialogs.deleteTitle', { ns: 'nodes' })}
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
					{t('dialogs.deleteConfirm', { ns: 'nodes' })}{' '}
					<b>{nodeName || t('labels.withoutName', { ns: 'nodes' })}</b>?
				</DialogContentText>
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
