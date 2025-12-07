import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './CreatePermissionRequestModal.module.css'
import type { ICreatePermissionRequestDto } from '@/entities/permission-request'
import { useCreatePermissionRequest } from '@/entities/permission-request'
import { AppButton, AppModal } from '@/shared/ui'

interface CreatePermissionRequestModalProps {
	open: boolean
	onClose: () => void
}

export const CreatePermissionRequestModal = ({
	open,
	onClose
}: CreatePermissionRequestModalProps) => {
	const { t } = useTranslation('notifications')
	const { mutate: createRequest, isPending } = useCreatePermissionRequest()

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<ICreatePermissionRequestDto>({
		defaultValues: {
			requestedRole: undefined,
			reason: ''
		},
		mode: 'onChange'
	})

	const handleFormSubmit = (data: ICreatePermissionRequestDto) => {
		createRequest(
			{
				requestedRole: data.requestedRole,
				reason: data.reason?.trim() || undefined
			},
			{
				onSuccess: () => {
					reset()
					onClose()
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
			title={t('labels.createRequest')}
			variant='primary'
			maxWidth='sm'
		>
			<form
				onSubmit={handleSubmit(handleFormSubmit)}
				className={styles.form}
			>
				<Controller
					name='requestedRole'
					control={control}
					rules={{
						required: t('errors.required', { ns: 'common' })
					}}
					render={({ field }) => (
						<FormControl
							fullWidth
							margin='normal'
							error={!!errors.requestedRole}
						>
							<InputLabel>{t('labels.requestedRole')}</InputLabel>
							<Select
								{...field}
								label={t('labels.requestedRole')}
								disabled={isPending}
							>
								<MenuItem value='admin'>
									{t('profile.role.admin', { ns: 'common' })}
								</MenuItem>
								<MenuItem value='superAdmin'>
									{t('profile.role.superAdmin', { ns: 'common' })}
								</MenuItem>
							</Select>
							{errors.requestedRole && (
								<span className={styles.errorText}>
									{errors.requestedRole.message}
								</span>
							)}
						</FormControl>
					)}
				/>

				<Controller
					name='reason'
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label={t('labels.reason')}
							placeholder={t('placeholders.reason')}
							variant='outlined'
							fullWidth
							multiline
							rows={4}
							error={!!errors.reason}
							helperText={errors.reason?.message}
							margin='normal'
							disabled={isPending}
						/>
					)}
				/>

				<div className={styles.actions}>
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
						{t('labels.createRequest')}
					</AppButton>
				</div>
			</form>
		</AppModal>
	)
}
