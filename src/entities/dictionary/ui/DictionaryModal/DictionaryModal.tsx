import CloseIcon from '@mui/icons-material/Close'
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography
} from '@mui/material'

import type {
	ICreateDictionaryDto,
	IDictionary,
	IUpdateDictionaryDto
} from '../../model/types'
import { DictionaryForm } from '../DictionaryForm'

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
				sx: {
					borderRadius: '12px'
				}
			}}
		>
			<DialogTitle
				sx={{
					backgroundColor: '#0073e6',
					color: '#fff',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '16px 24px'
				}}
			>
				<Typography sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
					{mode === 'create' ? 'Добавить запись' : 'Редактировать запись'}
				</Typography>
				<IconButton
					aria-label='close'
					onClick={onClose}
					sx={{
						color: '#fff',
						'&:hover': {
							backgroundColor: 'rgba(255, 255, 255, 0.1)'
						}
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ padding: '24px' }}>
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
