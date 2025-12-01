import LogoutIcon from '@mui/icons-material/Logout'
import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import styles from './UserInfoModal.module.css'
import { type IUser, userService } from '@/entities/user'
import { AppButton, AppModal } from '@/shared/ui'

interface Props {
	onClose: () => void
	onLogout: () => void
	onProfileUpdate?: () => void
}

type UserFormData = Partial<IUser> & { password?: string }

export const UserInfoModal = ({
	onClose,
	onLogout,
	onProfileUpdate
}: Props) => {
	const { t } = useTranslation('common')
	const { register, handleSubmit, reset, watch } = useForm<UserFormData>()
	const nameValue = watch('name')
	const emailValue = watch('email')

	const [requestSent, setRequestSent] = useState(false)

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const user = await userService.getProfile()
				reset(user)
			} catch (error) {
				console.error('Ошибка при загрузке профиля:', error)
			}
		}
		fetchUser()
	}, [reset])

	const onSubmit = async (data: Partial<IUser>) => {
		try {
			await userService.updateProfile(data)
			toast.success(t('profile.saveSuccess'))
			onProfileUpdate?.()
			onClose()
		} catch (error) {
			toast.error(t('errors.profileUpdateError'))
		}
	}

	const handleRequestRights = () => {
		toast.success(t('profile.requestRightsSuccess'))
		setRequestSent(true)
	}

	return (
		<AppModal
			open={true}
			onClose={onClose}
			title={t('profile.title')}
			variant='primary'
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={styles.form}
			>
				<TextField
					label={nameValue ? '' : t('labels.name')}
					fullWidth
					{...register('name')}
					placeholder={t('placeholders.fullName')}
					margin='normal'
				/>
				<TextField
					label={emailValue ? '' : t('labels.email')}
					type='email'
					fullWidth
					{...register('email')}
					placeholder={t('placeholders.email')}
					disabled
					margin='normal'
				/>
				<TextField
					label={t('labels.password')}
					type='password'
					fullWidth
					{...register('password')}
					placeholder={t('placeholders.password')}
					margin='normal'
				/>

				<div className={styles.actions}>
					<AppButton
						type='button'
						variant='secondary'
						onClick={handleRequestRights}
						disabled={requestSent}
					>
						{t('profile.requestRights')}
					</AppButton>
					<AppButton
						type='submit'
						variant='primary'
					>
						{t('buttons.save')}
					</AppButton>
				</div>

				<AppButton
					startIcon={<LogoutIcon />}
					variant='danger'
					onClick={onLogout}
					fullWidth
					sx={{ mt: 2 }}
				>
					{t('buttons.logout')}
				</AppButton>
			</form>
		</AppModal>
	)
}
