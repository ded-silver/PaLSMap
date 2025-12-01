import AddIcon from '@mui/icons-material/Add'
import MapIcon from '@mui/icons-material/Map'
import { CircularProgress, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import styles from './PathAreasListPage.module.css'
import type { Country } from '@/entities/country'
import { useCountry } from '@/entities/country'
import type { PathArea } from '@/entities/path-area'
import {
	useCreatePathArea,
	useDeletePathArea,
	usePathAreasByCountry,
	useUpdatePathArea
} from '@/entities/path-area'
import type { CreatePathAreaDto, UpdatePathAreaDto } from '@/entities/path-area'
import { useIsAdmin } from '@/entities/user'
import { AppButton } from '@/shared/ui'
import { CreatePathModal } from '@/widgets/create-path-modal'
import { PathCard } from '@/widgets/path-card'

export const PathAreasListPage = () => {
	const { t } = useTranslation(['common', 'path-areas'])
	const { countryId } = useParams<{ countryId: string }>()
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const mode = searchParams.get('mode')

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState<PathArea | null>(null)
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

	const isAdmin = useIsAdmin()

	const { data: country } = useCountry(countryId || '')
	const {
		data: areas,
		isLoading,
		error
	} = usePathAreasByCountry(countryId || '')
	const { mutate: createPathArea, isPending: isCreating } = useCreatePathArea()
	const { mutate: updatePathArea, isPending: isUpdating } = useUpdatePathArea()
	const { mutate: deletePathArea, isPending: isDeleting } = useDeletePathArea()

	const handleAdd = () => {
		setModalMode('create')
		setSelectedItem(null)
		setIsModalOpen(true)
	}

	const handleEdit = (item: PathArea | Country) => {
		setModalMode('edit')
		setSelectedItem(item as PathArea)
		setIsModalOpen(true)
	}

	const handleDelete = (id: string, countryId?: string) => {
		const item = areas?.find(a => a.id === id)
		if (item) {
			setSelectedItem(item)
			setIsDeleteDialogOpen(true)
		}
	}

	const handleOpenMap = () => {
		if (countryId) {
			navigate(`/map/${countryId}?mode=map`)
		}
	}

	const handleModalSubmit = (data: CreatePathAreaDto | UpdatePathAreaDto) => {
		if (modalMode === 'create') {
			createPathArea(data as CreatePathAreaDto, {
				onSuccess: () => {
					setIsModalOpen(false)
					setSelectedItem(null)
				}
			})
		} else if (selectedItem) {
			updatePathArea(
				{ id: selectedItem.id, dto: data as UpdatePathAreaDto },
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
			deletePathArea(
				{ id: selectedItem.id, countryId: selectedItem.countryId },
				{
					onSuccess: () => {
						setIsDeleteDialogOpen(false)
						setSelectedItem(null)
					}
				}
			)
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

	if (!countryId) {
		return (
			<div className={styles.container}>
				<div className={styles.contentWrapper}>
					<div className={styles.noResults}>
						{t('errors.invalidCountry', { ns: 'path-areas' })}
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.container}>
				<div className={styles.contentWrapper}>
					<div className={styles.header}>
						<div className={styles.titleSection}>
							<MapIcon className={styles.headerIcon} />
							<div>
								<Typography
									variant='h4'
									component='h1'
									className={styles.pageTitle}
								>
									{t('labels.pathAreas', { ns: 'path-areas' })}
								</Typography>
							</div>
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

	if (mode === 'map') {
		return null
	}

	return (
		<div className={styles.container}>
			<div className={styles.contentWrapper}>
				<div className={styles.header}>
					<div className={styles.titleSection}>
						<MapIcon className={styles.headerIcon} />
						<div>
							<Typography
								variant='h4'
								component='h1'
								className={styles.pageTitle}
							>
								{t('labels.pathAreas', { ns: 'path-areas' })}
							</Typography>
							{country && (
								<Typography
									variant='body2'
									className={styles.subtitle}
								>
									{country.name}
									{country.code && ` (${country.code})`}
								</Typography>
							)}
						</div>
					</div>

					<div className={styles.buttonGroup}>
						<AppButton
							variant='secondary'
							onClick={handleOpenMap}
							startIcon={<MapIcon />}
						>
							{t('labels.openMap', { ns: 'path-areas' })}
						</AppButton>
						{isAdmin && (
							<AppButton
								variant='primary'
								onClick={handleAdd}
								startIcon={<AddIcon />}
							>
								{t('labels.createPathArea', { ns: 'path-areas' })}
							</AppButton>
						)}
					</div>
				</div>

				{isLoading ? (
					<div className={styles.loading}>
						<CircularProgress />
					</div>
				) : areas && areas.length > 0 ? (
					<div className={styles.grid}>
						{areas.map(area => (
							<PathCard
								key={area.id}
								type='area'
								item={area}
								onEdit={isAdmin ? handleEdit : undefined}
								onDelete={isAdmin ? handleDelete : undefined}
							/>
						))}
					</div>
				) : (
					<div className={styles.emptyState}>
						<MapIcon className={styles.emptyIcon} />
						<Typography
							variant='h6'
							className={styles.emptyTitle}
						>
							{t('labels.noPathAreas', { ns: 'path-areas' })}
						</Typography>
						<Typography
							variant='body2'
							className={styles.emptyText}
						>
							{t('labels.createFirstPathArea', { ns: 'path-areas' }) ||
								'Create your first path area to get started'}
						</Typography>
						{isAdmin && (
							<AppButton
								variant='primary'
								onClick={handleAdd}
								startIcon={<AddIcon />}
								sx={{ mt: 2 }}
							>
								{t('labels.createPathArea', { ns: 'path-areas' })}
							</AppButton>
						)}
					</div>
				)}
			</div>

			<CreatePathModal
				isOpen={isModalOpen}
				mode={modalMode}
				type='area'
				item={selectedItem || undefined}
				countryId={countryId}
				onClose={handleModalClose}
				onSubmit={handleModalSubmit}
				isLoading={isCreating || isUpdating}
			/>

			{selectedItem && (
				<DeleteConfirmDialog
					isOpen={isDeleteDialogOpen}
					item={selectedItem}
					type='area'
					onClose={handleDeleteDialogClose}
					onConfirm={handleDeleteConfirm}
					isLoading={isDeleting}
				/>
			)}
		</div>
	)
}
