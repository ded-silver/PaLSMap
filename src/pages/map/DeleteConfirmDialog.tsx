import { DialogContentText, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import type { Country } from '@/entities/country'
import type { PathArea } from '@/entities/path-area'
import { MUI_STYLES } from '@/shared/styles/mui-styles'
import { AppButton, AppModal } from '@/shared/ui'

interface DeleteConfirmDialogProps {
	isOpen: boolean
	item: Country | PathArea
	type: 'country' | 'area'
	onClose: () => void
	onConfirm: () => void
	isLoading?: boolean
}

export const DeleteConfirmDialog = ({
	isOpen,
	item,
	type,
	onClose,
	onConfirm,
	isLoading
}: DeleteConfirmDialogProps) => {
	const { t } = useTranslation(['common', 'path-areas'])

	return (
		<AppModal
			open={isOpen}
			onClose={onClose}
			title={t('messages.deleteTitle', { ns: 'path-areas' })}
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
							: t('actions.delete', { ns: 'path-areas' })}
					</AppButton>
				</>
			}
		>
			<DialogContentText sx={{ marginTop: '16px' }}>
				{t('messages.deleteConfirm', { ns: 'path-areas' })}
			</DialogContentText>
			<div style={{ marginTop: '16px' }}>
				<Typography
					variant='body2'
					sx={{
						...MUI_STYLES.typography.bodyBold,
						...MUI_STYLES.spacing.mb1
					}}
				>
					{type === 'country'
						? t('labels.country', { ns: 'path-areas' })
						: t('labels.pathArea', { ns: 'path-areas' })}
				</Typography>
				<Typography variant='body1'>{item.name}</Typography>
			</div>
		</AppModal>
	)
}
