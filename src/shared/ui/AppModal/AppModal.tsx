import CloseIcon from '@mui/icons-material/Close'
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography
} from '@mui/material'
import { ReactNode } from 'react'

import { MUI_STYLES } from '@/shared/styles/mui-styles'

type AppModalVariant = 'primary' | 'error'

interface AppModalProps {
	open: boolean
	onClose: () => void
	title: string
	children: ReactNode
	variant?: AppModalVariant
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	fullWidth?: boolean
	actions?: ReactNode
}

export const AppModal = ({
	open,
	onClose,
	title,
	children,
	variant = 'primary',
	maxWidth = 'sm',
	fullWidth = true,
	actions
}: AppModalProps) => {
	const titleStyle =
		variant === 'error'
			? MUI_STYLES.dialogTitleError
			: MUI_STYLES.dialogTitlePrimary

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth={maxWidth}
			fullWidth={fullWidth}
			PaperProps={{
				sx: MUI_STYLES.dialogPaper
			}}
		>
			<DialogTitle sx={titleStyle}>
				<Typography sx={MUI_STYLES.typography.titleMedium}>{title}</Typography>
				<IconButton
					aria-label='close'
					onClick={onClose}
					sx={MUI_STYLES.iconButtonClosePrimary}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={MUI_STYLES.dialogContent}>{children}</DialogContent>

			{actions && (
				<DialogActions sx={MUI_STYLES.dialogActions}>{actions}</DialogActions>
			)}
		</Dialog>
	)
}
