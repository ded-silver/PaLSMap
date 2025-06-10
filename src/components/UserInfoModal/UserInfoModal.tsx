import CloseIcon from '@mui/icons-material/Close'
import LogoutIcon from '@mui/icons-material/Logout'
import { Button, IconButton, TextField } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { userService } from '../../services/user.service'
import { IUser } from '../../types/auth.types'

import styles from './UserInfoModal.module.css'

interface Props {
	onClose: () => void
	onLogout: () => void
}

type UserFormData = Partial<IUser> & { password?: string }

export const UserInfoModal = ({ onClose, onLogout }: Props) => {
	const { register, handleSubmit, reset, watch } = useForm<UserFormData>()
	const nameValue = watch('name')
	const emailValue = watch('email')

	// Загрузка текущего профиля при открытии формы
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
			onClose()
		} catch (error) {
			alert('Ошибка при обновлении профиля')
		}
	}

	// Запрос на повышение прав
	const handleRequestRights = async () => {
		try {
			await userService.requestRightsUpgrade()
			alert('Запрос на повышение прав отправлен')
			onClose()
		} catch (error) {
			alert('Ошибка при запросе прав')
		}
	}

	return (
		<div className={styles.overlay}>
			<div className={styles.modalContainer}>
				<div className={styles.topButtons}>
					<IconButton
						onClick={onClose}
						className={styles.closeButton}
						aria-label='Закрыть'
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
						label={nameValue ? '' : 'ФИО'}
						fullWidth
						{...register('name')}
						placeholder='Фамилия Имя Отчество'
					/>
					<TextField
						label={emailValue ? '' : 'Email'}
						type='email'
						fullWidth
						{...register('email')}
						placeholder='example@mail.com'
					/>
					<TextField
						label='Пароль'
						type='password'
						fullWidth
						{...register('password')}
						placeholder='••••••••'
					/>

					<div className={styles.actions}>
						<Button
							variant='outlined'
							type='button'
							onClick={handleRequestRights}
						>
							Запросить права
						</Button>
						<Button
							variant='contained'
							type='submit'
						>
							Сохранить
						</Button>
					</div>

					<Button
						startIcon={<LogoutIcon />}
						variant='text'
						color='error'
						onClick={onLogout}
						className={styles.logoutButton}
					>
						Выйти
					</Button>
				</form>
			</div>
		</div>
	)
}
