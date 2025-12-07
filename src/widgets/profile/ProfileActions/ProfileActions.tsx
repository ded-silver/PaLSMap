import CloseIcon from '@mui/icons-material/Close'
import LogoutIcon from '@mui/icons-material/Logout'
import SecurityIcon from '@mui/icons-material/Security'
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
import { authService } from '@/entities/user'
import { MUI_STYLES } from '@/shared/styles/mui-styles'
import { AppButton } from '@/shared/ui'
import { CreatePermissionRequestModal } from '@/widgets/permission-request-modal'

interface ProfileActionsProps {
	isAdmin: boolean
}

export const ProfileActions = ({ isAdmin }: ProfileActionsProps) => {
	const { t } = useTranslation(['common', 'notifications'])
	const navigate = useNavigate()
	const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
	const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] =
		useState(false)

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

	const handleCreateRequest = () => {
		setIsCreateRequestModalOpen(true)
	}

	const handleViewRequests = () => {
		navigate('/profile/permission-requests')
	}

	return (
		<div className={styles.container}>
			<div className={styles.actions}>
				{!isAdmin && (
					<>
						<Button
							variant='outlined'
							color='primary'
							startIcon={<SecurityIcon />}
							onClick={handleCreateRequest}
							className={styles.actionButton}
						>
							{t('labels.createRequest', { ns: 'notifications' })}
						</Button>
						<Button
							variant='outlined'
							color='primary'
							onClick={handleViewRequests}
							className={styles.actionButton}
						>
							{t('labels.myRequests', { ns: 'notifications' })}
						</Button>
					</>
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

			{!isAdmin && (
				<CreatePermissionRequestModal
					open={isCreateRequestModalOpen}
					onClose={() => setIsCreateRequestModalOpen(false)}
				/>
			)}

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
