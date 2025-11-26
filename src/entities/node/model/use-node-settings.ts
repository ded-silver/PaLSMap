import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { NodeService } from './api'
import type { CustomNode, VisualState } from './types'
import { useIsAdmin } from '@/entities/user'

type NodeType = 'OPS' | 'TankPark' | 'Checkpoint'

interface UseNodeSettingsProps {
	id: string
	data: CustomNode['data']
	nodeType: NodeType
}

export function useNodeSettings({ id, data, nodeType }: UseNodeSettingsProps) {
	const { t } = useTranslation(['common', 'nodes'])
	const { getNode, setNodes } = useReactFlow()
	const queryClient = useQueryClient()
	const isAdmin = useIsAdmin()

	const node = getNode(id)

	const [nodeName, setNodeName] = useState<string>(data.label)
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [editingName, setEditingName] = useState<string>(data.label)
	const [isLocked, setIsLocked] = useState<boolean>(data.locked ?? false)
	const [initialLocked, setInitialLocked] = useState<boolean>(
		data.locked ?? false
	)
	const [visualState, setVisualState] = useState<VisualState | undefined>(
		data.visualState
	)
	const [initialVisualState, setInitialVisualState] = useState<
		VisualState | undefined
	>(data.visualState)
	const [confirmOpen, setConfirmOpen] = useState(false)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (drawerOpen) {
			setInitialLocked(data.locked ?? false)
			setInitialVisualState(data.visualState)
		}
	}, [drawerOpen, data.locked, data.visualState])

	useEffect(() => {
		setVisualState(data.visualState)
		setInitialVisualState(data.visualState)
		setNodeName(data.label)
		setIsLocked(data.locked ?? false)
		setInitialLocked(data.locked ?? false)
	}, [data.visualState, data.label, data.locked])

	useEffect(() => {
		if (node && isAdmin) {
			const shouldBeDraggable = !isLocked
			if (node.draggable !== shouldBeDraggable) {
				setNodes(nodes =>
					nodes.map(n =>
						n.id === id ? { ...n, draggable: shouldBeDraggable } : n
					)
				)
			}
		}
	}, [isLocked, isAdmin, node, id, setNodes])

	const { mutate: deleteNode } = useMutation({
		mutationKey: ['deleteNode'],
		mutationFn: (nodeId: string) => NodeService.delete(nodeId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
		},
		onError: () => {
			toast.error(t('messages.deleteError', { ns: 'nodes' }))
		}
	})

	const { mutate: updateNode, isPending: isSaving } = useMutation({
		mutationKey: ['updateNode'],
		mutationFn: ({
			newName,
			newLocked,
			newVisualState
		}: {
			newName: string
			newLocked: boolean
			newVisualState?: VisualState
		}) => {
			if (!node?.position) throw new Error('Node position not found')
			const updatedData = {
				...data,
				label: newName,
				visualState: newVisualState
			}
			return NodeService.update(id, {
				...node,
				id,
				type: nodeType,
				position: node.position,
				data: updatedData,
				locked: newLocked,
				visualState: newVisualState
			})
		},
		onSuccess: (_, variables) => {
			setNodeName(variables.newName)
			setIsLocked(variables.newLocked)
			setInitialLocked(variables.newLocked)
			if (variables.newVisualState !== undefined) {
				setVisualState(variables.newVisualState)
				setInitialVisualState(variables.newVisualState)
			}
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
			setDrawerOpen(false)
		},
		onError: () => {
			toast.error(t('messages.updateDataError', { ns: 'nodes' }))
		}
	})

	const handleLockChange = (locked: boolean) => {
		setIsLocked(locked)
	}

	const handleVisualStateChange = (newVisualState: VisualState) => {
		setVisualState(newVisualState)
	}

	const handleSaveFromDrawer = (
		newName: string,
		newLocked: boolean,
		newVisualState?: VisualState
	) => {
		const nameChanged = newName !== nodeName
		const lockChanged = newLocked !== initialLocked
		const currentStatus = newVisualState?.status || 'normal'
		const originalStatus = initialVisualState?.status || 'normal'
		const visualStateChanged = currentStatus !== originalStatus

		if (nameChanged || lockChanged || visualStateChanged) {
			updateNode({
				newName,
				newLocked,
				newVisualState: newVisualState || visualState
			})
		}
	}

	const handleDelete = () => {
		deleteNode(id)
	}

	const { mutate: toggleLock, isPending: isTogglingLock } = useMutation({
		mutationKey: ['toggleLock', id],
		mutationFn: () => {
			if (!node?.position) throw new Error('Node position not found')
			const newLocked = !isLocked
			const updatedData = {
				...data,
				label: nodeName,
				visualState: visualState
			}
			return NodeService.update(id, {
				...node,
				id,
				type: nodeType,
				position: node.position,
				data: updatedData,
				locked: newLocked,
				visualState: visualState
			})
		},
		onSuccess: () => {
			const newLocked = !isLocked
			setIsLocked(newLocked)
			setInitialLocked(newLocked)
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
		},
		onError: () => {
			toast.error(t('messages.updateDataError', { ns: 'nodes' }))
		}
	})

	const handleLockToggle = () => {
		toggleLock()
	}

	const handleCloseDrawer = () => {
		setEditingName(nodeName)
		setIsLocked(initialLocked)
		setVisualState(initialVisualState)
		setDrawerOpen(false)
	}

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		queryClient.invalidateQueries({ queryKey: ['currentNodeData'] })
		setOpen(false)
	}

	return {
		nodeName,
		setNodeName,
		drawerOpen,
		setDrawerOpen,
		editingName,
		setEditingName,
		isLocked,
		initialLocked,
		visualState,
		initialVisualState,
		confirmOpen,
		setConfirmOpen,
		open,
		setOpen,
		isSaving,
		isTogglingLock,
		isAdmin,

		handleLockChange,
		handleLockToggle,
		handleVisualStateChange,
		handleSaveFromDrawer,
		handleDelete,
		handleCloseDrawer,
		handleClickOpen,
		handleClose
	}
}
