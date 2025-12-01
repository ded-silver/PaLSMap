import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './CreatePathForm.module.css'
import type { CreateCountryDto, UpdateCountryDto } from '@/entities/country'
import type { Country } from '@/entities/country'
import type { CreatePathAreaDto, UpdatePathAreaDto } from '@/entities/path-area'
import { AppButton } from '@/shared/ui'

interface CreatePathFormProps {
	type: 'country' | 'area'
	initialData?: Country | { id: string; name: string; countryId?: string }
	countryId?: string
	countries: Country[]
	onSubmit: (
		data:
			| CreateCountryDto
			| CreatePathAreaDto
			| UpdateCountryDto
			| UpdatePathAreaDto
	) => void
	onCancel: () => void
	isLoading?: boolean
}

export const CreatePathForm = ({
	type,
	initialData,
	countryId,
	countries,
	onSubmit,
	onCancel,
	isLoading
}: CreatePathFormProps) => {
	const { t } = useTranslation(['common', 'path-areas'])

	const isCountry = type === 'country'

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<CreateCountryDto | CreatePathAreaDto>({
		defaultValues: {
			name: initialData?.name || '',
			...(isCountry
				? { code: initialData && 'code' in initialData ? initialData.code : '' }
				: {
						countryId:
							countryId ||
							(initialData && 'countryId' in initialData
								? initialData.countryId
								: '')
					})
		},
		mode: 'onChange'
	})

	const handleFormSubmit = (data: CreateCountryDto | CreatePathAreaDto) => {
		onSubmit(data)
	}

	return (
		<form
			onSubmit={handleSubmit(handleFormSubmit)}
			className={styles.form}
		>
			<Controller
				name='name'
				control={control}
				rules={{
					required: t('validation.nameRequired', { ns: 'path-areas' }),
					minLength: {
						value: 1,
						message: t('validation.nameMinLength', { ns: 'path-areas' })
					}
				}}
				render={({ field }) => (
					<TextField
						{...field}
						label={t('labels.name', { ns: 'path-areas' })}
						variant='outlined'
						fullWidth
						error={!!errors.name}
						helperText={errors.name?.message}
						disabled={isLoading}
						margin='normal'
					/>
				)}
			/>

			{isCountry && (
				<Controller
					name='code'
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label={t('labels.code', { ns: 'path-areas' })}
							variant='outlined'
							fullWidth
							disabled={isLoading}
							margin='normal'
						/>
					)}
				/>
			)}

			{!isCountry && (
				<Controller
					name='countryId'
					control={control}
					rules={{
						required: t('validation.countryRequired', { ns: 'path-areas' })
					}}
					render={({ field }) => (
						<FormControl
							fullWidth
							margin='normal'
							error={!!(errors as any).countryId}
							disabled={isLoading || !!countryId}
						>
							<InputLabel>
								{t('labels.country', { ns: 'path-areas' })}
							</InputLabel>
							<Select
								{...field}
								label={t('labels.country', { ns: 'path-areas' })}
								disabled={isLoading || !!countryId}
							>
								{countries.map(country => (
									<MenuItem
										key={country.id}
										value={country.id}
									>
										{country.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
				/>
			)}

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
