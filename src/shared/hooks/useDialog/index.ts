import { useCallback, useState } from 'react'

export const useDialog = () => {
	const [isOpen, setIsOpen] = useState(false)

	const handleDialogOpen = useCallback(() => {
		setIsOpen(true)
	}, [])

	const handleDialogClose = useCallback(() => {
		setIsOpen(false)
	}, [])

	return { isOpen, handleDialogOpen, handleDialogClose }
}
