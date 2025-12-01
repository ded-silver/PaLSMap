import { useCallback, useState } from 'react'

type ModalMode = 'create' | 'edit'

interface UseListPageOptions<T, CreateDto, UpdateDto> {
	onCreate: (data: CreateDto, options?: { onSuccess?: () => void }) => void
	onUpdate: (
		params: { id: string; dto: UpdateDto },
		options?: { onSuccess?: () => void }
	) => void
	onDelete: (id: string, options?: { onSuccess?: () => void }) => void
}

interface UseListPageReturn<T, CreateDto, UpdateDto> {
	isModalOpen: boolean
	isDeleteDialogOpen: boolean
	selectedItem: T | null
	modalMode: ModalMode
	setIsModalOpen: (open: boolean) => void
	setIsDeleteDialogOpen: (open: boolean) => void
	setSelectedItem: (item: T | null) => void
	setModalMode: (mode: ModalMode) => void
	handleAdd: () => void
	handleEdit: (item: T) => void
	handleDelete: (id: string, findItem: (id: string) => T | undefined) => void
	handleModalSubmit: (data: CreateDto | UpdateDto) => void
	handleDeleteConfirm: () => void
	handleModalClose: () => void
	handleDeleteDialogClose: () => void
}

export const useListPage = <
	T extends { id: string },
	CreateDto = unknown,
	UpdateDto = unknown
>(
	options: UseListPageOptions<T, CreateDto, UpdateDto>
): UseListPageReturn<T, CreateDto, UpdateDto> => {
	const { onCreate, onUpdate, onDelete } = options

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState<T | null>(null)
	const [modalMode, setModalMode] = useState<ModalMode>('create')

	const handleAdd = useCallback(() => {
		setModalMode('create')
		setSelectedItem(null)
		setIsModalOpen(true)
	}, [])

	const handleEdit = useCallback((item: T) => {
		setModalMode('edit')
		setSelectedItem(item)
		setIsModalOpen(true)
	}, [])

	const handleDelete = useCallback(
		(id: string, findItem: (id: string) => T | undefined) => {
			const item = findItem(id)
			if (item) {
				setSelectedItem(item)
				setIsDeleteDialogOpen(true)
			}
		},
		[]
	)

	const handleModalSubmit = useCallback(
		(data: CreateDto | UpdateDto) => {
			if (modalMode === 'create') {
				onCreate(data as CreateDto, {
					onSuccess: () => {
						setIsModalOpen(false)
						setSelectedItem(null)
					}
				})
			} else if (selectedItem) {
				onUpdate(
					{ id: selectedItem.id, dto: data as UpdateDto },
					{
						onSuccess: () => {
							setIsModalOpen(false)
							setSelectedItem(null)
						}
					}
				)
			}
		},
		[modalMode, selectedItem, onCreate, onUpdate]
	)

	const handleDeleteConfirm = useCallback(() => {
		if (selectedItem) {
			onDelete(selectedItem.id, {
				onSuccess: () => {
					setIsDeleteDialogOpen(false)
					setSelectedItem(null)
				}
			})
		}
	}, [selectedItem, onDelete])

	const handleModalClose = useCallback(() => {
		setIsModalOpen(false)
		setSelectedItem(null)
	}, [])

	const handleDeleteDialogClose = useCallback(() => {
		setIsDeleteDialogOpen(false)
		setSelectedItem(null)
	}, [])

	return {
		isModalOpen,
		isDeleteDialogOpen,
		selectedItem,
		modalMode,
		setIsModalOpen,
		setIsDeleteDialogOpen,
		setSelectedItem,
		setModalMode,
		handleAdd,
		handleEdit,
		handleDelete,
		handleModalSubmit,
		handleDeleteConfirm,
		handleModalClose,
		handleDeleteDialogClose
	}
}
