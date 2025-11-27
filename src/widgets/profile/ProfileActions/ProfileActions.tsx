import LogoutIcon from '@mui/icons-material/Logout'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import styles from './ProfileActions.module.css'
import { authService, userService } from '@/entities/user'
import { MUI_STYLES } from '@/shared/styles/constants'

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
				<DialogTitle>
					<Typography sx={MUI_STYLES.typography.titleSmall}>
						{t('profile.actions.logoutConfirmTitle')}
					</Typography>
				</DialogTitle>

				<DialogContent>
					<DialogContentText>
						{t('profile.actions.logoutConfirmMessage')}
					</DialogContentText>
				</DialogContent>

				<DialogActions sx={MUI_STYLES.dialogActions}>
					<Button
						onClick={() => setIsLogoutDialogOpen(false)}
						variant='outlined'
					>
						{t('buttons.cancel')}
					</Button>
					<Button
						onClick={handleLogout}
						variant='contained'
						color='error'
						startIcon={<LogoutIcon />}
					>
						{t('profile.actions.logout')}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
