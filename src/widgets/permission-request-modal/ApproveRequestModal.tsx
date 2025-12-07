import { DialogContentText, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { IApproveRequestDto } from '@/entities/permission-request'
import { useApproveRequest } from '@/entities/permission-request'
import { AppButton, AppModal } from '@/shared/ui'

interface ApproveRequestModalProps {
	open: boolean
	onClose: () => void
	requestId: string
	userName: string
}

export const ApproveRequestModal = ({
	open,
	onClose,
	requestId,
	userName
}: ApproveRequestModalProps) => {
	const { t } = useTranslation(['common', 'notifications'])
	const { mutate: approveRequest, isPending } = useApproveRequest()

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<IApproveRequestDto>({
		defaultValues: {
			reason: ''
		},
		mode: 'onChange'
	})

	const handleFormSubmit = (data: IApproveRequestDto) => {
		approveRequest(
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
			title={t('labels.approveRequest', { ns: 'notifications' })}
			variant='primary'
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
						variant='primary'
					>
						{isPending
							? t('messages.saving', { ns: 'common' })
							: t('labels.approve', { ns: 'notifications' })}
					</AppButton>
				</>
			}
		>
			<DialogContentText sx={{ marginTop: '16px' }}>
				{t('confirmations.approveRequest', {
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
						label={t('labels.reason', { ns: 'notifications' })}
						placeholder={t('placeholders.reason', { ns: 'notifications' })}
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
