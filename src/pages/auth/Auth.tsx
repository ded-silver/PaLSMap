import { Button, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import styles from './Auth.module.css'
import {
	type IAuthForm,
	USER_PROFILE_QUERY_KEY,
	authService
} from '@/entities/user'
import { resetAuthState } from '@/shared/lib/auth-manager'

export function Auth() {
	const { t } = useTranslation(['common', 'auth'])
	const queryClient = useQueryClient()
	const [tab, setTab] = useState<'login' | 'register'>('login')
	const { register, handleSubmit, reset } = useForm<IAuthForm>({
		mode: 'onChange'
	})
	const navigate = useNavigate()

	const { mutate: auth } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: IAuthForm) =>
			authService.main(tab === 'login' ? 'login' : 'register', data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })
			toast.success(t('messages.success', { ns: 'auth' }))
			reset()
			navigate('/')
		},
		onError: () => {
			toast.error(
				tab === 'login'
					? t('messages.loginError', { ns: 'auth' })
					: t('messages.registerError', { ns: 'auth' })
			)
		}
	})

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		if (tab === 'login') {
			resetAuthState()
		}

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
						label={t('tabs.login', { ns: 'auth' })}
					/>
					<Tab
						value='register'
						label={t('tabs.register', { ns: 'auth' })}
					/>
				</Tabs>

				<Typography
					variant='h5'
					align='center'
				>
					{tab === 'login'
						? t('tabs.login', { ns: 'auth' })
						: t('tabs.register', { ns: 'auth' })}
				</Typography>

				<TextField
					label={t('fields.email', { ns: 'auth' })}
					type='email'
					{...register('email', {
						required: t('validation.emailRequired', { ns: 'auth' })
					})}
				/>

				<TextField
					label={t('fields.password', { ns: 'auth' })}
					type='password'
					{...register('password', {
						required: t('validation.passwordRequired', { ns: 'auth' })
					})}
				/>

				{tab === 'register' && (
					<TextField
						label={t('fields.name', { ns: 'auth' })}
						placeholder={t('fields.namePlaceholder', { ns: 'auth' })}
						{...register('name')}
					/>
				)}

				<Button
					type='submit'
					variant='contained'
				>
					{tab === 'login'
						? t('buttons.login', { ns: 'auth' })
						: t('buttons.register', { ns: 'auth' })}
				</Button>
			</form>
		</div>
	)
}
