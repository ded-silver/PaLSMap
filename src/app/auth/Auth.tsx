import { Button, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { authService } from '../../services/auth.service'
import { IAuthForm } from '../../types/auth.types'

import styles from './Auth.module.css'

export function Auth() {
	const [tab, setTab] = useState<'login' | 'register'>('login')
	const { register, handleSubmit, reset } = useForm<IAuthForm>({
		mode: 'onChange'
	})
	const navigate = useNavigate()

	const { mutate: auth } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: IAuthForm) =>
			authService.main(tab === 'login' ? 'login' : 'register', data),
		onSuccess: data => {
			localStorage.setItem('authToken', data!.data!.accessToken!)
			toast.success('Успешно!')
			reset()
			navigate('/')
		},
		onError: () => {
			toast.error(tab === 'login' ? 'Ошибка входа' : 'Ошибка регистрации')
		}
	})

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		auth({ ...data, isAdmin: false })
	}

	return (
		<div className={styles.container}>
			<form
				className={styles.form}
				onSubmit={handleSubmit(onSubmit)}
			>
				<Tabs
					value={tab}
					onChange={(_, value) => setTab(value)}
					variant='fullWidth'
				>
					<Tab
						value='login'
						label='Вход'
					/>
					<Tab
						value='register'
						label='Регистрация'
					/>
				</Tabs>

				<Typography
					variant='h5'
					align='center'
				>
					{tab === 'login' ? 'Вход' : 'Регистрация'}
				</Typography>

				<TextField
					label='Email'
					type='email'
					{...register('email', { required: 'Email обязателен' })}
				/>

				<TextField
					label='Пароль'
					type='password'
					{...register('password', { required: 'Пароль обязателен' })}
				/>

				{tab === 'register' && (
					<TextField
						label='ФИО (необязательно)'
						placeholder='Иванов Иван Иванович'
						{...register('name')}
					/>
				)}

				<Button
					type='submit'
					variant='contained'
				>
					{tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
				</Button>
			</form>
		</div>
	)
}
