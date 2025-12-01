import CloseIcon from '@mui/icons-material/Close'
import LogoutIcon from '@mui/icons-material/Logout'
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
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import styles from './ProfileActions.module.css'
import { authService, userService } from '@/entities/user'
import { MUI_STYLES } from '@/shared/styles/mui-styles'
import { AppButton } from '@/shared/ui'

interface ProfileActionsProps {
	isAdmin: boolean
}

export const ProfileActions = ({ isAdmin }: ProfileActionsProps) => {
	const { t } = useTranslation('common')
	const navigate = useNavigate()
	const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
	const [isRequestingRights, setIsRequestingRights] = useState(false)

	const handleLogout = async () => {
		try {
			await authService.logout()
		} catch (error) {
			toast.error(t('errors.logoutError'))
		} finally {
			setIsLogoutDialogOpen(false)
			navigate('/auth')
		}
	}

	const handleRequestRights = async () => {
		try {
			setIsRequestingRights(true)
			await userService.requestRightsUpgrade()
			toast.success(t('profile.requestRightsSuccess'))
		} catch (error) {
			toast.error(t('errors.profileUpdateError'))
		} finally {
			setIsRequestingRights(false)
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.actions}>
				{!isAdmin && (
					<Button
						variant='outlined'
						color='primary'
						onClick={handleRequestRights}
						disabled={isRequestingRights}
						className={styles.actionButton}
					>
						{t('profile.requestRights')}
					</Button>
				)}

				<Button
					variant='contained'
					color='error'
					startIcon={<LogoutIcon />}
					onClick={() => setIsLogoutDialogOpen(true)}
					className={styles.actionButton}
				>
					{t('profile.actions.logout')}
				</Button>
			</div>

			<Dialog
				open={isLogoutDialogOpen}
				onClose={() => setIsLogoutDialogOpen(false)}
				maxWidth='sm'
				fullWidth
				PaperProps={{
					sx: MUI_STYLES.dialogPaper
				}}
			>
				<DialogTitle sx={MUI_STYLES.dialogTitleError}>
					<Typography sx={MUI_STYLES.typography.titleMedium}>
						{t('profile.actions.logoutConfirmTitle')}
					</Typography>
					<IconButton
						aria-label='close'
						onClick={() => setIsLogoutDialogOpen(false)}
						sx={MUI_STYLES.iconButtonClosePrimary}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>

				<DialogContent sx={MUI_STYLES.dialogContent}>
					<DialogContentText sx={{ marginTop: '16px' }}>
						{t('profile.actions.logoutConfirmMessage')}
					</DialogContentText>
				</DialogContent>

				<DialogActions sx={MUI_STYLES.dialogActions}>
					<AppButton
						onClick={() => setIsLogoutDialogOpen(false)}
						variant='secondary'
					>
						{t('buttons.cancel')}
					</AppButton>
					<AppButton
						onClick={handleLogout}
						variant='danger'
						startIcon={<LogoutIcon />}
					>
						{t('profile.actions.logout')}
					</AppButton>
				</DialogActions>
			</Dialog>
		</div>
	)
}
