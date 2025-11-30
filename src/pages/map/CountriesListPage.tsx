import AddIcon from '@mui/icons-material/Add'
import PublicIcon from '@mui/icons-material/Public'
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
			<div className={styles.container}>
				<div className={styles.contentWrapper}>
					<div className={styles.header}>
						<div className={styles.titleSection}>
							<PublicIcon className={styles.headerIcon} />
							<Typography
								variant='h4'
								component='h1'
								className={styles.pageTitle}
							>
								{t('labels.countries', { ns: 'path-areas' })}
							</Typography>
						</div>
					</div>
					<div className={styles.errorState}>
						<Typography variant='h6'>
							{t('errors.loadError', { ns: 'common' })}
						</Typography>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<div className={styles.contentWrapper}>
				<div className={styles.header}>
					<div className={styles.titleSection}>
						<PublicIcon className={styles.headerIcon} />
						<Typography
							variant='h4'
							component='h1'
							className={styles.pageTitle}
						>
							{t('labels.countries', { ns: 'path-areas' })}
						</Typography>
					</div>

					<div className={styles.buttonGroup}>
						{isAdmin && (
							<Button
								variant='contained'
								color='primary'
								onClick={handleAdd}
								className={styles.createButton}
								startIcon={<AddIcon />}
							>
								{t('labels.createCountry', { ns: 'path-areas' })}
							</Button>
						)}
					</div>
				</div>

				{isLoading ? (
					<div className={styles.loading}>
						<CircularProgress />
					</div>
				) : countries && countries.length > 0 ? (
					<div className={styles.grid}>
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
					<div className={styles.emptyState}>
						<PublicIcon className={styles.emptyIcon} />
						<Typography
							variant='h6'
							className={styles.emptyTitle}
						>
							{t('labels.noCountries', { ns: 'path-areas' })}
						</Typography>
						<Typography
							variant='body2'
							className={styles.emptyText}
						>
							{t('labels.createFirstCountry', { ns: 'path-areas' }) ||
								'Create your first country to get started'}
						</Typography>
						{isAdmin && (
							<Button
								variant='contained'
								color='primary'
								onClick={handleAdd}
								className={styles.createButton}
								startIcon={<AddIcon />}
								sx={{ mt: 2 }}
							>
								{t('labels.createCountry', { ns: 'path-areas' })}
							</Button>
						)}
					</div>
				)}
			</div>

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
