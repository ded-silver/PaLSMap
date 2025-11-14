import { Button, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './ChangePasswordForm.module.css'
import type { IChangePasswordDto } from '@/entities/user'

interface ChangePasswordFormProps {
	onChangePassword: (dto: IChangePasswordDto) => void
	isChanging: boolean
}

export const ChangePasswordForm = ({
	onChangePassword,
	isChanging
}: ChangePasswordFormProps) => {
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
	}

	return (
		<div className={styles.container}>
			<Typography
				variant='h6'
				className={styles.title}
			>
				{t('profile.security.title')}
			</Typography>

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
						type='submit'
						variant='contained'
						color='primary'
						disabled={isChanging}
					>
						{isChanging
							? t('messages.saving')
							: t('profile.security.changePassword')}
					</Button>
				</div>
			</form>
		</div>
	)
}
