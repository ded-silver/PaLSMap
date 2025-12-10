import { useTranslation } from 'react-i18next'

import { CreatePathForm } from './CreatePathForm'
import type { CreateCountryDto, UpdateCountryDto } from '@/entities/country'
import type { Country } from '@/entities/country'
import { useCountries } from '@/entities/country'
import type { CreatePathAreaDto, UpdatePathAreaDto } from '@/entities/path-area'
import { AppModal } from '@/shared/ui'

interface CreatePathModalProps {
	isOpen: boolean
	mode: 'create' | 'edit'
	type: 'country' | 'area'
	item?: Country | { id: string; name: string; countryId?: string }
	countryId?: string
	onClose: () => void
	onSubmit: (
		data:
			| CreateCountryDto
			| CreatePathAreaDto
			| UpdateCountryDto
			| UpdatePathAreaDto
	) => void
	isLoading?: boolean
}

export const CreatePathModal = ({
	isOpen,
	mode,
	type,
	item,
	countryId,
	onClose,
	onSubmit,
	isLoading
}: CreatePathModalProps) => {
	const { t } = useTranslation('path-areas')
	const { data: countries } = useCountries()

	const getTitle = () => {
		if (mode === 'create') {
			return type === 'country'
				? t('labels.createCountry')
				: t('labels.createPathArea')
		}
		return type === 'country'
			? t('buttons.edit', { ns: 'common' })
			: t('buttons.edit', { ns: 'common' })
	}

	return (
		<AppModal
			open={isOpen}
			onClose={onClose}
			title={getTitle()}
			variant='primary'
		>
			<CreatePathForm
				key={item?.id || 'create'}
				type={type}
				initialData={item}
				countryId={countryId}
				countries={countries || []}
				onSubmit={onSubmit}
				onCancel={onClose}
				isLoading={isLoading}
			/>
		</AppModal>
	)
}
