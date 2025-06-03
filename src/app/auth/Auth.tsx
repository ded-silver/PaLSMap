import { Button, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { authService } from '../../services/auth.service'
import { IAuthForm } from '../../types/auth.types'

import styles from './Auth.module.css'

export function Auth() {
	const { register, handleSubmit, reset } = useForm<IAuthForm>({
		mode: 'onChange'
	})

	const navigate = useNavigate()

	const { mutate: auth } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: IAuthForm) =>
			authService.main(isLoginForm ? 'login' : 'register', data),
		onSuccess: data => {
			localStorage.setItem('authToken', data!.data!.accessToken!)
			localStorage.setItem('userId', data!.data.user.id.toString())
			toast.success('Successfully logged in!')
			reset()
			navigate('/')
		},
		onError: error => {
			toast.error('Login or registration failed.')
		}
	})

	const [isLoginForm, setIsLoginForm] = useState(false)

	const handleLogin: SubmitHandler<IAuthForm> = data => {
		setIsLoginForm(true)
		auth({ ...data, isAdmin: false })
	}

	const handleRegister: SubmitHandler<IAuthForm> = data => {
		setIsLoginForm(false)
		auth({ ...data, isAdmin: false })
	}

	return (
		<div className={styles.container}>
			<form className={styles.form}>
				<Typography
					variant='h5'
					align='center'
					color='rgb(102,102,102)'
				>
					Авторизация
				</Typography>

				<TextField
					id='email'
					label='Email:'
					placeholder='Введите email:'
					type='email'
					{...register('email', {
						required: 'Email is required!'
					})}
				/>

				<TextField
					id='password'
					label='Пароль:'
					placeholder='Введите пароль:'
					type='password'
					{...register('password', {
						required: 'Password is required!'
					})}
				/>

				<Button
					variant='contained'
					onClick={handleSubmit(handleLogin)}
				>
					Вход
				</Button>
				<Button
					variant='outlined'
					onClick={handleSubmit(handleRegister)}
				>
					Регистрация
				</Button>
			</form>
		</div>
	)
}
