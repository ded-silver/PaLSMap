import { Button, CircularProgress, Typography } from '@mui/material'
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
import { SearchBar } from '@/shared/ui'

export const DictionaryPage = () => {
	const { t } = useTranslation(['common', 'dictionary'])
	const [searchTerm, setSearchTerm] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState<IDictionary | null>(null)
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

	const isAdmin = localStorage.getItem('isAdmin') === 'true'

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
			<div className={styles['main-content']}>
				<Typography
					sx={{ fontSize: '2.125rem' }}
					className={styles.pageTitle}
					gutterBottom
				>
					{t('title', { ns: 'dictionary' })}
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
				sx={{ fontSize: '2.125rem' }}
				className={styles.pageTitle}
				gutterBottom
			>
				{t('title', { ns: 'dictionary' })}
			</Typography>

			<div className={styles.header}>
				<div className={styles.searchAndActions}>
					<div className={styles.searchBarWrapper}>
						<SearchBar
							placeholder={t('placeholders.searchAbbreviations', {
								ns: 'common'
							})}
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</div>

					{isAdmin && (
						<Button
							variant='contained'
							color='primary'
							onClick={handleAdd}
							className={styles.addButton}
						>
							{t('buttons.add', { ns: 'dictionary' })}
						</Button>
					)}
				</div>
			</div>

			{isLoading ? (
				<div className={styles.loading}>
					<CircularProgress />
				</div>
			) : filteredDictionaries.length > 0 ? (
				<div className={styles.abbreviationList}>
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
				<div className={styles.noResults}>
					{t('messages.empty', { ns: 'dictionary' })}
				</div>
			) : (
				<div className={styles.noResults}>
					{t('messages.noResults', { ns: 'dictionary' })}
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
	)
}
