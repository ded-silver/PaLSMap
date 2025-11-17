import CloseIcon from '@mui/icons-material/Close'
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
	Typography
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './ChangePasswordModal.module.css'
import type { IChangePasswordDto } from '@/entities/user'
import { MUI_STYLES } from '@/shared/styles/constants'

interface ChangePasswordModalProps {
	open: boolean
	onClose: () => void
	onChangePassword: (dto: IChangePasswordDto) => void
	isChanging: boolean
}

export const ChangePasswordModal = ({
	open,
	onClose,
	onChangePassword,
	isChanging
}: ChangePasswordModalProps) => {
	const { t } = useTranslation('common')
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		watch
	} = useForm<IChangePasswordDto>({
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		},
		mode: 'onChange'
	})

	const newPassword = watch('newPassword')

	const handleFormSubmit = (data: IChangePasswordDto) => {
		onChangePassword(data)
		reset()
		onClose()
	}

	const handleClose = () => {
		reset()
		onClose()
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth='sm'
			fullWidth
			PaperProps={{
				sx: MUI_STYLES.dialogPaper
			}}
		>
			<DialogTitle sx={MUI_STYLES.dialogTitlePrimary}>
				<Typography sx={MUI_STYLES.typography.titleMedium}>
					{t('profile.security.changePassword')}
				</Typography>
				<IconButton
					aria-label='close'
					onClick={handleClose}
					sx={MUI_STYLES.iconButtonClosePrimary}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={MUI_STYLES.dialogContent}>
				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className={styles.form}
				>
					<Controller
						name='currentPassword'
						control={control}
						rules={{
							required: t('validation.required')
						}}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('profile.security.currentPassword')}
								type='password'
								variant='outlined'
								fullWidth
								error={!!errors.currentPassword}
								helperText={errors.currentPassword?.message}
								disabled={isChanging}
								margin='normal'
							/>
						)}
					/>

					<Controller
						name='newPassword'
						control={control}
						rules={{
							required: t('validation.required'),
							minLength: {
								value: 6,
								message: t('validation.passwordMinLength')
							}
						}}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('profile.security.newPassword')}
								type='password'
								variant='outlined'
								fullWidth
								error={!!errors.newPassword}
								helperText={errors.newPassword?.message}
								disabled={isChanging}
								margin='normal'
							/>
						)}
					/>

					<Controller
						name='confirmPassword'
						control={control}
						rules={{
							required: t('validation.required'),
							validate: value =>
								value === newPassword || t('validation.passwordsDoNotMatch')
						}}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('profile.security.confirmPassword')}
								type='password'
								variant='outlined'
								fullWidth
								error={!!errors.confirmPassword}
								helperText={errors.confirmPassword?.message}
								disabled={isChanging}
								margin='normal'
							/>
						)}
					/>

					<div className={styles.actions}>
						<Button
							type='button'
							onClick={handleClose}
							variant='outlined'
							disabled={isChanging}
						>
							{t('buttons.cancel')}
						</Button>
						<Button
							type='submit'
							variant='contained'
							disabled={isChanging}
							color='primary'
						>
							{isChanging
								? t('messages.saving')
								: t('profile.security.changePassword')}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}

