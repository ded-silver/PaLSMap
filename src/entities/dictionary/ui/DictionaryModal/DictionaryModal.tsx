import CloseIcon from '@mui/icons-material/Close'
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import type {
	ICreateDictionaryDto,
	IDictionary,
	IUpdateDictionaryDto
} from '../../model/types'
import { DictionaryForm } from '../DictionaryForm'

import { MUI_STYLES } from '@/shared/styles/constants'

interface DictionaryModalProps {
	isOpen: boolean
	mode: 'create' | 'edit'
	item?: IDictionary
	onClose: () => void
	onSubmit: (data: ICreateDictionaryDto | IUpdateDictionaryDto) => void
	isLoading?: boolean
}

export const DictionaryModal = ({
	isOpen,
	mode,
	item,
	onClose,
	onSubmit,
	isLoading
}: DictionaryModalProps) => {
	const { t } = useTranslation('dictionary')

	const handleSubmit = (data: ICreateDictionaryDto | IUpdateDictionaryDto) => {
		onSubmit(data)
	}

	const handleCancel = () => {
		onClose()
	}

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth='md'
			fullWidth
			PaperProps={{
				sx: MUI_STYLES.dialogPaper
			}}
		>
			<DialogTitle sx={MUI_STYLES.dialogTitlePrimary}>
				<Typography sx={MUI_STYLES.typography.titleMedium}>
					{mode === 'create' ? t('buttons.add') : t('buttons.edit')}
				</Typography>
				<IconButton
					aria-label='close'
					onClick={onClose}
					sx={MUI_STYLES.iconButtonClosePrimary}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={MUI_STYLES.dialogContent}>
				<DictionaryForm
					key={item?.id || 'create'}
					initialData={item}
					onSubmit={handleSubmit}
					onCancel={handleCancel}
					isLoading={isLoading}
				/>
			</DialogContent>
		</Dialog>
	)
}
