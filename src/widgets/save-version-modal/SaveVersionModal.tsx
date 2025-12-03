import { TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import styles from './SaveVersionModal.module.css'
import { getErrorMessage } from '@/entities/map-version'
import { useCreateVersion } from '@/entities/map-version'
import { AppButton, AppModal } from '@/shared/ui'

interface Props {
	open: boolean
	onClose: () => void
	pathAreaId: string
	onSuccess: () => void
}

interface FormData {
	name: string
	description?: string
}

export const SaveVersionModal = ({
	open,
	onClose,
	pathAreaId,
	onSuccess
}: Props) => {
	const { t } = useTranslation(['map-versions', 'common'])
	const { mutate: createVersion, isPending } = useCreateVersion()

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<FormData>({
		defaultValues: {
			name: '',
			description: ''
		}
	})

	const onSubmit = (data: FormData) => {
		createVersion(
			{
				name: data.name.trim(),
				description: data.description?.trim() || undefined,
				pathAreaId
			},
			{
				onSuccess: () => {
					reset()
					onSuccess()
				},
				onError: (error: unknown) => {
					toast.error(
						getErrorMessage(
							error,
							t('messages.saveError', { ns: 'map-versions' })
						)
					)
				}
			}
		)
	}

	const handleClose = () => {
		if (!isPending) {
			reset()
			onClose()
		}
	}

	return (
		<AppModal
			open={open}
			onClose={handleClose}
			title={t('labels.saveVersion', { ns: 'map-versions' })}
			variant='primary'
			maxWidth='sm'
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					{...register('name', {
						required: t('errors.versionNameRequired', {
							ns: 'map-versions'
						}),
						minLength: {
							value: 1,
							message: t('errors.versionNameMinLength', {
								ns: 'map-versions'
							})
						}
					})}
					label={t('labels.versionName', { ns: 'map-versions' })}
					placeholder={t('placeholders.versionName', {
						ns: 'map-versions'
					})}
					variant='outlined'
					fullWidth
					error={!!errors.name}
					helperText={errors.name?.message}
					margin='normal'
					disabled={isPending}
				/>

				<TextField
					{...register('description')}
					label={t('labels.versionDescription', { ns: 'map-versions' })}
					placeholder={t('placeholders.versionDescription', {
						ns: 'map-versions'
					})}
					variant='outlined'
					fullWidth
					multiline
					rows={4}
					error={!!errors.description}
					helperText={errors.description?.message}
					margin='normal'
					disabled={isPending}
				/>

				<div className={styles['form-actions']}>
					<AppButton
						type='button'
						variant='secondary'
						onClick={handleClose}
						disabled={isPending}
					>
						{t('buttons.cancel', { ns: 'common' })}
					</AppButton>
					<AppButton
						type='submit'
						variant='primary'
						loading={isPending}
						disabled={isPending}
					>
						{t('buttons.save', { ns: 'common' })}
					</AppButton>
				</div>
			</form>
		</AppModal>
	)
}
