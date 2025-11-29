import CloseIcon from '@mui/icons-material/Close'
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { CreatePathForm } from './CreatePathForm'
import type { CreateCountryDto, UpdateCountryDto } from '@/entities/country'
import type { Country } from '@/entities/country'
import { useCountries } from '@/entities/country'
import type { CreatePathAreaDto, UpdatePathAreaDto } from '@/entities/path-area'
import { MUI_STYLES } from '@/shared/styles/constants'

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
		return type === 'country' ? t('actions.edit') : t('actions.edit')
	}

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth='sm'
			fullWidth
			PaperProps={{
				sx: MUI_STYLES.dialogPaper
			}}
		>
			<DialogTitle sx={MUI_STYLES.dialogTitlePrimary}>
				<Typography sx={MUI_STYLES.typography.titleMedium}>
					{getTitle()}
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
			</DialogContent>
		</Dialog>
	)
}
