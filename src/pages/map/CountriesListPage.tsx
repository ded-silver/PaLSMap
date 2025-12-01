import AddIcon from '@mui/icons-material/Add'
import PublicIcon from '@mui/icons-material/Public'
import { CircularProgress, Typography } from '@mui/material'
import { useCallback } from 'react'
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
import { useListPage } from '@/shared/hooks'
import { AppButton } from '@/shared/ui'
import { CreatePathModal } from '@/widgets/create-path-modal'
import { PathCard } from '@/widgets/path-card'

export const CountriesListPage = () => {
	const { t } = useTranslation(['common', 'path-areas'])

	const isAdmin = useIsAdmin()

	const { data: countries, isLoading, error } = useCountries()
	const { mutate: createCountry, isPending: isCreating } = useCreateCountry()
	const { mutate: updateCountry, isPending: isUpdating } = useUpdateCountry()
	const { mutate: deleteCountry, isPending: isDeleting } = useDeleteCountry()

	const {
		isModalOpen,
		isDeleteDialogOpen,
		selectedItem,
		modalMode,
		handleAdd,
		handleEdit,
		handleDelete: handleDeleteBase,
		handleModalSubmit,
		handleDeleteConfirm,
		handleModalClose,
		handleDeleteDialogClose
	} = useListPage<Country, CreateCountryDto, UpdateCountryDto>({
		onCreate: createCountry,
		onUpdate: updateCountry,
		onDelete: deleteCountry
	})

	const handleDelete = useCallback(
		(id: string) => {
			handleDeleteBase(id, (id: string) => countries?.find(c => c.id === id))
		},
		[countries, handleDeleteBase]
	)

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
							<AppButton
								variant='primary'
								onClick={handleAdd}
								startIcon={<AddIcon />}
							>
								{t('labels.createCountry', { ns: 'path-areas' })}
							</AppButton>
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
							<AppButton
								variant='primary'
								onClick={handleAdd}
								startIcon={<AddIcon />}
								sx={{ mt: 2 }}
							>
								{t('labels.createCountry', { ns: 'path-areas' })}
							</AppButton>
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
