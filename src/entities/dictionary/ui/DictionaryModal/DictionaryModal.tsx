import { useTranslation } from 'react-i18next'

import type {
	ICreateDictionaryDto,
	IDictionary,
	IUpdateDictionaryDto
} from '../../model/types'
import { DictionaryForm } from '../DictionaryForm'

import { AppModal } from '@/shared/ui'

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
		<AppModal
			open={isOpen}
			onClose={onClose}
			title={mode === 'create' ? t('buttons.add') : t('buttons.edit')}
			variant='primary'
		>
			<DictionaryForm
				key={item?.id || 'create'}
				initialData={item}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				isLoading={isLoading}
			/>
		</AppModal>
	)
}
