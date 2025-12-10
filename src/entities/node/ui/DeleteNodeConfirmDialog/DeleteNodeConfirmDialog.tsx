import { DialogContentText } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { AppButton, AppModal } from '@/shared/ui'

interface DeleteNodeConfirmDialogProps {
	isOpen: boolean
	nodeName: string
	onClose: () => void
	onConfirm: () => void
	isLoading?: boolean
}

export const DeleteNodeConfirmDialog = ({
	isOpen,
	nodeName,
	onClose,
	onConfirm,
	isLoading
}: DeleteNodeConfirmDialogProps) => {
	const { t } = useTranslation(['common', 'nodes'])

	return (
		<AppModal
			open={isOpen}
			onClose={onClose}
			title={t('confirmations.deleteTitle', { ns: 'common' })}
			variant='error'
			actions={
				<>
					<AppButton
						onClick={onClose}
						disabled={isLoading}
						variant='secondary'
					>
						{t('buttons.cancel', { ns: 'common' })}
					</AppButton>
					<AppButton
						onClick={onConfirm}
						loading={isLoading}
						disabled={isLoading}
						variant='danger'
					>
						{isLoading
							? t('messages.deleting', { ns: 'common' })
							: t('buttons.delete', { ns: 'common' })}
					</AppButton>
				</>
			}
		>
			<DialogContentText sx={{ marginTop: '16px' }}>
				{t('confirmations.deleteConfirm', { ns: 'common' })}{' '}
				<b>{nodeName || t('labels.withoutName', { ns: 'nodes' })}</b>?
			</DialogContentText>
		</AppModal>
	)
}
