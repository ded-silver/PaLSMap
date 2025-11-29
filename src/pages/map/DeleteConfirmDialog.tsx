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

import type { Country } from '@/entities/country'
import type { PathArea } from '@/entities/path-area'
import { MUI_STYLES } from '@/shared/styles/constants'

interface DeleteConfirmDialogProps {
	isOpen: boolean
	item: Country | PathArea
	type: 'country' | 'area'
	onClose: () => void
	onConfirm: () => void
	isLoading?: boolean
}

export const DeleteConfirmDialog = ({
	isOpen,
	item,
	type,
	onClose,
	onConfirm,
	isLoading
}: DeleteConfirmDialogProps) => {
	const { t } = useTranslation(['common', 'path-areas'])

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
					{t('messages.deleteTitle', { ns: 'path-areas' })}
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
					{t('messages.deleteConfirm', { ns: 'path-areas' })}
				</DialogContentText>
				<div style={{ marginTop: '16px' }}>
					<Typography
						variant='body2'
						sx={{
							...MUI_STYLES.typography.bodyBold,
							...MUI_STYLES.spacing.mb1
						}}
					>
						{type === 'country'
							? t('labels.country', { ns: 'path-areas' })
							: t('labels.pathArea', { ns: 'path-areas' })}
					</Typography>
					<Typography variant='body1'>{item.name}</Typography>
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
						: t('actions.delete', { ns: 'path-areas' })}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
