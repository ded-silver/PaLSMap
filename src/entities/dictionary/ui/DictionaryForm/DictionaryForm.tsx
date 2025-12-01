import { TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type {
	ICreateDictionaryDto,
	IDictionary,
	IUpdateDictionaryDto
} from '../../model/types'

import styles from './DictionaryForm.module.css'
import { AppButton } from '@/shared/ui'

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
	const { t } = useTranslation(['common', 'dictionary'])
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
					required: t('validation.shortRequired', { ns: 'dictionary' }),
					minLength: {
						value: 1,
						message: t('validation.shortMinLength', { ns: 'dictionary' })
					}
				}}
				render={({ field }) => (
					<TextField
						{...field}
						label={t('fields.short', { ns: 'dictionary' })}
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
					required: t('validation.fullRequired', { ns: 'dictionary' }),
					minLength: {
						value: 1,
						message: t('validation.fullMinLength', { ns: 'dictionary' })
					}
				}}
				render={({ field }) => (
					<TextField
						{...field}
						label={t('fields.full', { ns: 'dictionary' })}
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
				<AppButton
					type='button'
					variant='secondary'
					onClick={onCancel}
					disabled={isLoading}
				>
					{t('buttons.cancel', { ns: 'common' })}
				</AppButton>
				<AppButton
					type='submit'
					variant='primary'
					loading={isLoading}
					disabled={isLoading}
				>
					{isLoading
						? t('messages.saving', { ns: 'common' })
						: t('buttons.save', { ns: 'common' })}
				</AppButton>
			</div>
		</form>
	)
}
