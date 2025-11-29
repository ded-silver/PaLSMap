import { Button, CircularProgress, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import styles from './PathAreasListPage.module.css'
import type { Country } from '@/entities/country'
import type { PathArea } from '@/entities/path-area'
import {
	useCreatePathArea,
	useDeletePathArea,
	usePathAreasByCountry,
	useUpdatePathArea
} from '@/entities/path-area'
import type { CreatePathAreaDto, UpdatePathAreaDto } from '@/entities/path-area'
import { useIsAdmin } from '@/entities/user'
import { MUI_STYLES } from '@/shared/styles/constants'
import { CreatePathModal } from '@/widgets/create-path-modal'
import { PathBreadcrumbs } from '@/widgets/path-breadcrumbs'
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
			<div className={styles['main-content']}>
				<div className={styles.noResults}>
					{t('errors.invalidCountry', { ns: 'path-areas' })}
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles['main-content']}>
				<PathBreadcrumbs />
				<Typography
					sx={MUI_STYLES.typography.titleLarge}
					className={styles.pageTitle}
					gutterBottom
				>
					{t('labels.pathAreas', { ns: 'path-areas' })}
				</Typography>
				<div className={styles.noResults}>
					{t('errors.loadError', { ns: 'common' })}
				</div>
			</div>
		)
	}

	if (mode === 'map') {
		return null
	}

	return (
		<div className={styles['main-content']}>
			<PathBreadcrumbs />

			<Typography
				sx={MUI_STYLES.typography.titleLarge}
				className={styles.pageTitle}
				gutterBottom
			>
				{t('labels.pathAreas', { ns: 'path-areas' })}
			</Typography>

			<div className={styles.header}>
				<Button
					variant='outlined'
					color='primary'
					onClick={handleOpenMap}
					className={styles.openMapButton}
				>
					{t('labels.openMap', { ns: 'path-areas' })}
				</Button>
				{isAdmin && (
					<Button
						variant='contained'
						color='primary'
						onClick={handleAdd}
						className={styles.addButton}
					>
						{t('labels.createPathArea', { ns: 'path-areas' })}
					</Button>
				)}
			</div>

			{isLoading ? (
				<div className={styles.loading}>
					<CircularProgress />
				</div>
			) : areas && areas.length > 0 ? (
				<div className={styles.areasList}>
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
				<div className={styles.noResults}>
					{t('labels.noPathAreas', { ns: 'path-areas' })}
					{isAdmin && (
						<Button
							variant='contained'
							color='primary'
							onClick={handleAdd}
							className={styles.createButton}
							sx={{ mt: 2 }}
						>
							{t('labels.createPathArea', { ns: 'path-areas' })}
						</Button>
					)}
				</div>
			)}

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
