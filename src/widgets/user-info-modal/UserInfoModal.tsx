import CloseIcon from '@mui/icons-material/Close'
import LogoutIcon from '@mui/icons-material/Logout'
import { Button, IconButton, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import styles from './UserInfoModal.module.css'
import { type IUser, userService } from '@/entities/user'

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
		<div className={styles.overlay}>
			<div className={styles.modalContainer}>
				<div className={styles.topButtons}>
					<IconButton
						onClick={onClose}
						className={styles.closeButton}
						aria-label={t('buttons.close')}
						size='small'
					>
						<CloseIcon />
					</IconButton>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className={styles.form}
				>
					<TextField
						label={nameValue ? '' : t('labels.name')}
						fullWidth
						{...register('name')}
						placeholder={t('placeholders.fullName')}
					/>
					<TextField
						label={emailValue ? '' : t('labels.email')}
						type='email'
						fullWidth
						{...register('email')}
						placeholder={t('placeholders.email')}
						disabled
					/>
					<TextField
						label={t('labels.password')}
						type='password'
						fullWidth
						{...register('password')}
						placeholder={t('placeholders.password')}
					/>

					<div className={styles.actions}>
						<Button
							variant='outlined'
							type='button'
							onClick={handleRequestRights}
							disabled={requestSent}
						>
							{t('profile.requestRights')}
						</Button>
						<Button
							variant='contained'
							type='submit'
						>
							{t('buttons.save')}
						</Button>
					</div>

					<Button
						startIcon={<LogoutIcon />}
						variant='text'
						color='error'
						onClick={onLogout}
						className={styles.logoutButton}
					>
						{t('buttons.logout')}
					</Button>
				</form>
			</div>
		</div>
	)
}
