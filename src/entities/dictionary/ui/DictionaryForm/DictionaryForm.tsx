import { Button, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import type {
	ICreateDictionaryDto,
	IDictionary,
	IUpdateDictionaryDto
} from '../../model/types'

import styles from './DictionaryForm.module.css'

interface DictionaryFormProps {
	initialData?: IDictionary
	onSubmit: (data: ICreateDictionaryDto | IUpdateDictionaryDto) => void
	onCancel: () => void
	isLoading?: boolean
}

export const DictionaryForm = ({
	initialData,
	onSubmit,
	onCancel,
	isLoading
}: DictionaryFormProps) => {
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<ICreateDictionaryDto>({
		defaultValues: {
			short: initialData?.short || '',
			full: initialData?.full || ''
		},
		mode: 'onChange'
	})

	const handleFormSubmit = (data: ICreateDictionaryDto) => {
		onSubmit(data)
	}

	return (
		<form
			onSubmit={handleSubmit(handleFormSubmit)}
			className={styles.form}
		>
			<Controller
				name='short'
				control={control}
				rules={{
					required: 'Аббревиатура обязательна для заполнения',
					minLength: {
						value: 1,
						message: 'Аббревиатура должна содержать хотя бы 1 символ'
					}
				}}
				render={({ field }) => (
					<TextField
						{...field}
						label='Аббревиатура'
						variant='outlined'
						fullWidth
						error={!!errors.short}
						helperText={errors.short?.message}
						disabled={isLoading}
						margin='normal'
					/>
				)}
			/>

			<Controller
				name='full'
				control={control}
				rules={{
					required: 'Полное название обязательно для заполнения',
					minLength: {
						value: 1,
						message: 'Полное название должно содержать хотя бы 1 символ'
					}
				}}
				render={({ field }) => (
					<TextField
						{...field}
						label='Полное название'
						variant='outlined'
						fullWidth
						error={!!errors.full}
						helperText={errors.full?.message}
						disabled={isLoading}
						margin='normal'
						multiline
						rows={3}
					/>
				)}
			/>

			<div className={styles.actions}>
				<Button
					type='button'
					variant='outlined'
					onClick={onCancel}
					disabled={isLoading}
				>
					Отмена
				</Button>
				<Button
					type='submit'
					variant='contained'
					disabled={isLoading}
					color='primary'
				>
					{isLoading ? 'Сохранение...' : 'Сохранить'}
				</Button>
			</div>
		</form>
	)
}
