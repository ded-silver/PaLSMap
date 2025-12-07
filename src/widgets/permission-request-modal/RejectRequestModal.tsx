import { DialogContentText, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { IRejectRequestDto } from '@/entities/permission-request'
import { useRejectRequest } from '@/entities/permission-request'
import { AppButton, AppModal } from '@/shared/ui'

interface RejectRequestModalProps {
	open: boolean
	onClose: () => void
	requestId: string
	userName: string
}

export const RejectRequestModal = ({
	open,
	onClose,
	requestId,
	userName
}: RejectRequestModalProps) => {
	const { t } = useTranslation(['common', 'notifications'])
	const { mutate: rejectRequest, isPending } = useRejectRequest()

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<IRejectRequestDto>({
		defaultValues: {
			reason: ''
		},
		mode: 'onChange'
	})

	const handleFormSubmit = (data: IRejectRequestDto) => {
		rejectRequest(
			{
				id: requestId,
				dto: data.reason?.trim() ? data : undefined
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
			title={t('labels.rejectRequest', { ns: 'notifications' })}
			variant='error'
			maxWidth='sm'
			actions={
				<>
					<AppButton
						onClick={handleClose}
						disabled={isPending}
						variant='secondary'
					>
						{t('buttons.cancel', { ns: 'common' })}
					</AppButton>
					<AppButton
						onClick={handleSubmit(handleFormSubmit)}
						loading={isPending}
						disabled={isPending}
						variant='danger'
					>
						{isPending
							? t('messages.saving', { ns: 'common' })
							: t('labels.reject', { ns: 'notifications' })}
					</AppButton>
				</>
			}
		>
			<DialogContentText sx={{ marginTop: '16px' }}>
				{t('confirmations.rejectRequest', {
					name: userName,
					ns: 'notifications'
				})}
			</DialogContentText>

			<Controller
				name='reason'
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label={t('labels.rejectionReason', { ns: 'notifications' })}
						placeholder={t('placeholders.rejectionReason', {
							ns: 'notifications'
						})}
						variant='outlined'
						fullWidth
						multiline
						rows={3}
						error={!!errors.reason}
						helperText={errors.reason?.message}
						margin='normal'
						disabled={isPending}
						sx={{ marginTop: '16px' }}
					/>
				)}
			/>
		</AppModal>
	)
}
