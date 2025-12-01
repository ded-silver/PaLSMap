import { TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './ChangePasswordModal.module.css'
import type { IChangePasswordDto } from '@/entities/user'
import { AppButton, AppModal } from '@/shared/ui'

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
		<AppModal
			open={open}
			onClose={handleClose}
			title={t('profile.security.changePassword')}
			variant='primary'
		>
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
					<AppButton
						type='button'
						onClick={handleClose}
						variant='secondary'
						disabled={isChanging}
					>
						{t('buttons.cancel')}
					</AppButton>
					<AppButton
						type='submit'
						variant='primary'
						disabled={isChanging}
					>
						{isChanging
							? t('messages.saving')
							: t('profile.security.changePassword')}
					</AppButton>
				</div>
			</form>
		</AppModal>
	)
}
