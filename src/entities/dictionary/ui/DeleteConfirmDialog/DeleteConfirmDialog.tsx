import { DialogContentText, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import type { IDictionary } from '../../model/types'

import styles from './DeleteConfirmDialog.module.css'
import { MUI_STYLES } from '@/shared/styles/mui-styles'
import { AppButton, AppModal } from '@/shared/ui'

interface DeleteConfirmDialogProps {
	isOpen: boolean
	item: IDictionary
	onClose: () => void
	onConfirm: () => void
	isLoading?: boolean
}

export const DeleteConfirmDialog = ({
	isOpen,
	item,
	onClose,
	onConfirm,
	isLoading
}: DeleteConfirmDialogProps) => {
	const { t } = useTranslation(['common', 'dictionary'])

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
				{t('confirmations.deleteConfirm', { ns: 'common' })}
			</DialogContentText>
			<div className={styles.itemInfo}>
				<Typography
					variant='body2'
					sx={{
						...MUI_STYLES.typography.bodyBold,
						...MUI_STYLES.spacing.mb1
					}}
				>
					{t('messages.abbreviation', { ns: 'dictionary' })}
				</Typography>
				<Typography
					variant='body1'
					sx={MUI_STYLES.spacing.mb2px}
				>
					{item.short}
				</Typography>
				<Typography
					variant='body2'
					sx={{
						...MUI_STYLES.typography.bodyBold,
						...MUI_STYLES.spacing.mb1
					}}
				>
					{t('messages.fullName', { ns: 'dictionary' })}
				</Typography>
				<Typography variant='body1'>{item.full}</Typography>
			</div>
		</AppModal>
	)
}
