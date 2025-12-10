import AddIcon from '@mui/icons-material/Add'
import BookIcon from '@mui/icons-material/Book'
import { CircularProgress, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './Dictionary.module.css'
import {
	DeleteConfirmDialog,
	DictionaryItem,
	DictionaryModal
} from '@/entities/dictionary'
import {
	type ICreateDictionaryDto,
	type IDictionary,
	type IUpdateDictionaryDto,
	useCreateDictionary,
	useDeleteDictionary,
	useDictionaries,
	useUpdateDictionary
} from '@/entities/dictionary'
import { useIsAdmin } from '@/entities/user'
import { AppButton, SearchBar } from '@/shared/ui'

export const DictionaryPage = () => {
	const { t } = useTranslation(['common', 'dictionary'])
	const [searchTerm, setSearchTerm] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState<IDictionary | null>(null)
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

	const isAdmin = useIsAdmin()

	const { data, isLoading, error } = useDictionaries()
	const { mutate: createDictionary, isPending: isCreating } =
		useCreateDictionary()
	const { mutate: updateDictionary, isPending: isUpdating } =
		useUpdateDictionary()
	const { mutate: deleteDictionary, isPending: isDeleting } =
		useDeleteDictionary()

	const dictionaries = data?.items || []

	const filteredDictionaries = useMemo(() => {
		if (!searchTerm.trim()) {
			return dictionaries
		}

		const searchLower = searchTerm.toLowerCase()
		return dictionaries.filter(
			({ short, full }) =>
				short.toLowerCase().includes(searchLower) ||
				full.toLowerCase().includes(searchLower)
		)
	}, [dictionaries, searchTerm])

	const handleAdd = () => {
		setModalMode('create')
		setSelectedItem(null)
		setIsModalOpen(true)
	}

	const handleEdit = (item: IDictionary) => {
		setModalMode('edit')
		setSelectedItem(item)
		setIsModalOpen(true)
	}

	const handleDelete = (id: string) => {
		const item = dictionaries.find(d => d.id === id)
		if (item) {
			setSelectedItem(item)
			setIsDeleteDialogOpen(true)
		}
	}

	const handleModalSubmit = (
		data: ICreateDictionaryDto | IUpdateDictionaryDto
	) => {
		if (modalMode === 'create') {
			createDictionary(data as ICreateDictionaryDto, {
				onSuccess: () => {
					setIsModalOpen(false)
					setSelectedItem(null)
				}
			})
		} else if (selectedItem) {
			updateDictionary(
				{ id: selectedItem.id, dto: data as IUpdateDictionaryDto },
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
			deleteDictionary(selectedItem.id, {
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
							<BookIcon className={styles.headerIcon} />
							<Typography
								variant='h4'
								component='h1'
								className={styles.title}
							>
								{t('title', { ns: 'dictionary' })}
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
						<BookIcon className={styles.headerIcon} />
						<Typography
							variant='h4'
							component='h1'
							className={styles.title}
						>
							{t('title', { ns: 'dictionary' })}
						</Typography>
					</div>

					<div className={styles.buttonGroup}>
						<div className={styles.searchBarWrapper}>
							<SearchBar
								placeholder={t('placeholders.searchAbbreviations', {
									ns: 'common'
								})}
								onChange={e => setSearchTerm(e.target.value)}
							/>
						</div>
						{isAdmin && (
							<AppButton
								variant='primary'
								onClick={handleAdd}
								startIcon={<AddIcon />}
							>
								{t('buttons.add', { ns: 'dictionary' })}
							</AppButton>
						)}
					</div>
				</div>

				{isLoading ? (
					<div className={styles.loading}>
						<CircularProgress />
					</div>
				) : filteredDictionaries.length > 0 ? (
					<div className={styles.grid}>
						{filteredDictionaries.map(item => (
							<DictionaryItem
								key={item.id}
								item={item}
								isAdmin={isAdmin}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						))}
					</div>
				) : dictionaries.length === 0 ? (
					<div className={styles.emptyState}>
						<BookIcon className={styles.emptyIcon} />
						<Typography
							variant='h6'
							className={styles.emptyTitle}
						>
							{t('messages.empty', { ns: 'dictionary' })}
						</Typography>
						<Typography
							variant='body2'
							className={styles.emptyText}
						>
							{t('messages.createFirst', { ns: 'dictionary' }) ||
								'Create your first dictionary entry to get started'}
						</Typography>
						{isAdmin && (
							<AppButton
								variant='primary'
								onClick={handleAdd}
								className={styles.createButton}
								startIcon={<AddIcon />}
								sx={{ mt: 2 }}
							>
								{t('buttons.add', { ns: 'dictionary' })}
							</AppButton>
						)}
					</div>
				) : (
					<div className={styles.emptyState}>
						<BookIcon className={styles.emptyIcon} />
						<Typography
							variant='h6'
							className={styles.emptyTitle}
						>
							{t('messages.noResults', { ns: 'common' })}
						</Typography>
						<Typography
							variant='body2'
							className={styles.emptyText}
						>
							{t('messages.tryDifferentSearch', { ns: 'dictionary' }) ||
								'Try a different search term'}
						</Typography>
					</div>
				)}

				<DictionaryModal
					isOpen={isModalOpen}
					mode={modalMode}
					item={selectedItem || undefined}
					onClose={handleModalClose}
					onSubmit={handleModalSubmit}
					isLoading={isCreating || isUpdating}
				/>

				{selectedItem && (
					<DeleteConfirmDialog
						isOpen={isDeleteDialogOpen}
						item={selectedItem}
						onClose={handleDeleteDialogClose}
						onConfirm={handleDeleteConfirm}
						isLoading={isDeleting}
					/>
				)}
			</div>
		</div>
	)
}
