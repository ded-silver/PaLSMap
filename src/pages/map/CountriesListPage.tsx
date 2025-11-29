import { Button, CircularProgress, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './CountriesListPage.module.css'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import type { Country } from '@/entities/country'
import {
	useCountries,
	useCreateCountry,
	useDeleteCountry,
	useUpdateCountry
} from '@/entities/country'
import type { CreateCountryDto, UpdateCountryDto } from '@/entities/country'
import { useIsAdmin } from '@/entities/user'
import { MUI_STYLES } from '@/shared/styles/constants'
import { CreatePathModal } from '@/widgets/create-path-modal'
import { PathCard } from '@/widgets/path-card'

export const CountriesListPage = () => {
	const { t } = useTranslation(['common', 'path-areas'])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState<Country | null>(null)
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

	const isAdmin = useIsAdmin()

	const { data: countries, isLoading, error } = useCountries()
	const { mutate: createCountry, isPending: isCreating } = useCreateCountry()
	const { mutate: updateCountry, isPending: isUpdating } = useUpdateCountry()
	const { mutate: deleteCountry, isPending: isDeleting } = useDeleteCountry()

	const handleAdd = () => {
		setModalMode('create')
		setSelectedItem(null)
		setIsModalOpen(true)
	}

	const handleEdit = (item: Country) => {
		setModalMode('edit')
		setSelectedItem(item)
		setIsModalOpen(true)
	}

	const handleDelete = (id: string) => {
		const item = countries?.find(c => c.id === id)
		if (item) {
			setSelectedItem(item)
			setIsDeleteDialogOpen(true)
		}
	}

	const handleModalSubmit = (data: CreateCountryDto | UpdateCountryDto) => {
		if (modalMode === 'create') {
			createCountry(data as CreateCountryDto, {
				onSuccess: () => {
					setIsModalOpen(false)
					setSelectedItem(null)
				}
			})
		} else if (selectedItem) {
			updateCountry(
				{ id: selectedItem.id, dto: data as UpdateCountryDto },
				{
					onSuccess: () => {
						setIsModalOpen(false)
						setSelectedItem(null)
					}
				}
			)
		}
	}

	const handleDeleteConfirm = () => {
		if (selectedItem) {
			deleteCountry(selectedItem.id, {
				onSuccess: () => {
					setIsDeleteDialogOpen(false)
					setSelectedItem(null)
				}
			})
		}
	}

	const handleModalClose = () => {
		setIsModalOpen(false)
		setSelectedItem(null)
	}

	const handleDeleteDialogClose = () => {
		setIsDeleteDialogOpen(false)
		setSelectedItem(null)
	}

	if (error) {
		return (
			<div className={styles['main-content']}>
				<Typography
					sx={MUI_STYLES.typography.titleLarge}
					className={styles.pageTitle}
					gutterBottom
				>
					{t('labels.countries', { ns: 'path-areas' })}
				</Typography>
				<div className={styles.noResults}>
					{t('errors.loadError', { ns: 'common' })}
				</div>
			</div>
		)
	}

	return (
		<div className={styles['main-content']}>
			<Typography
				sx={MUI_STYLES.typography.titleLarge}
				className={styles.pageTitle}
				gutterBottom
			>
				{t('labels.countries', { ns: 'path-areas' })}
			</Typography>

			<div className={styles.header}>
				{isAdmin && (
					<Button
						variant='contained'
						color='primary'
						onClick={handleAdd}
						className={styles.addButton}
					>
						{t('labels.createCountry', { ns: 'path-areas' })}
					</Button>
				)}
			</div>

			{isLoading ? (
				<div className={styles.loading}>
					<CircularProgress />
				</div>
			) : countries && countries.length > 0 ? (
				<div className={styles.countriesList}>
					{countries.map(country => (
						<PathCard
							key={country.id}
							type='country'
							item={country}
							onEdit={isAdmin ? handleEdit : undefined}
							onDelete={isAdmin ? handleDelete : undefined}
						/>
					))}
				</div>
			) : (
				<div className={styles.noResults}>
					{t('labels.noCountries', { ns: 'path-areas' })}
					{isAdmin && (
						<Button
							variant='contained'
							color='primary'
							onClick={handleAdd}
							className={styles.createButton}
							sx={{ mt: 2 }}
						>
							{t('labels.createCountry', { ns: 'path-areas' })}
						</Button>
					)}
				</div>
			)}

			<CreatePathModal
				isOpen={isModalOpen}
				mode={modalMode}
				type='country'
				item={selectedItem || undefined}
				onClose={handleModalClose}
				onSubmit={handleModalSubmit}
				isLoading={isCreating || isUpdating}
			/>

			{selectedItem && (
				<DeleteConfirmDialog
					isOpen={isDeleteDialogOpen}
					item={selectedItem}
					type='country'
					onClose={handleDeleteDialogClose}
					onConfirm={handleDeleteConfirm}
					isLoading={isDeleting}
				/>
			)}
		</div>
	)
}
