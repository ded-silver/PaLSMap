import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ResizeDragEvent, ResizeParams, useReactFlow } from '@xyflow/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { NodeService } from './api'
import type { CustomNode, VisualState } from './types'
import { NodeDataService } from '@/entities/node-data'
import { useIsAdmin } from '@/entities/user'
import { useDebouncedCallback } from '@/shared/hooks'

type NodeType =
	| 'OPS'
	| 'TankPark'
	| 'Checkpoint'
	| 'Object'
	| 'Pump'
	| 'Valve'
	| 'AccountingSystem'
	| 'ChildObject'
	| 'ChildTankPark'
	| 'Capacity'
	| 'FGU'
	| 'KPPSOD'
	| 'SAR'
	| 'MNS'
	| 'PNS'
	| 'Factory'
	| 'River'
	| 'ParentObject'

interface UseNodeSettingsProps {
	id: string
	data: CustomNode['data']
	nodeType: NodeType
	parentId?: string
	supportVisualState?: boolean
	invalidateParentData?: boolean
	initialName?: string
}

export function useNodeSettings({
	id,
	data,
	nodeType,
	parentId,
	supportVisualState = false,
	invalidateParentData = false,
	initialName
}: UseNodeSettingsProps) {
	const { t } = useTranslation(['common', 'nodes'])
	const { getNode, setNodes } = useReactFlow()
	const queryClient = useQueryClient()
	const isAdmin = useIsAdmin()

	const node = getNode(id)

	const initialNodeName = initialName ?? data.label
	const [nodeName, setNodeName] = useState<string>(initialNodeName)
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [editingName, setEditingName] = useState<string>(initialNodeName)
	const [isLocked, setIsLocked] = useState<boolean>(data.locked ?? false)
	const [initialLocked, setInitialLocked] = useState<boolean>(
		data.locked ?? false
	)
	const [visualState, setVisualState] = useState<VisualState | undefined>(
		supportVisualState ? data.visualState : undefined
	)
	const [initialVisualState, setInitialVisualState] = useState<
		VisualState | undefined
	>(supportVisualState ? data.visualState : undefined)
	const [confirmOpen, setConfirmOpen] = useState(false)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (drawerOpen) {
			setInitialLocked(data.locked ?? false)
			if (supportVisualState) {
				setInitialVisualState(data.visualState)
			}
		}
	}, [drawerOpen, data.locked, data.visualState, supportVisualState])

	useEffect(() => {
		if (supportVisualState) {
			setVisualState(data.visualState)
			setInitialVisualState(data.visualState)
		}
		const newName = initialName ?? data.label
		setNodeName(newName)
		setEditingName(newName)
		setIsLocked(data.locked ?? false)
		setInitialLocked(data.locked ?? false)
	}, [
		data.visualState,
		data.label,
		data.locked,
		supportVisualState,
		initialName
	])

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
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
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
			newVisualState,
			measured
		}: {
			newName: string
			newLocked: boolean
			newVisualState?: VisualState
			measured?: { width: number; height: number }
		}) => {
			if (!node?.position) throw new Error('Node position not found')
			const updatedData = {
				...data,
				label: newName,
				...(supportVisualState && { visualState: newVisualState })
			}
			return NodeService.update(id, {
				...node,
				id,
				type: nodeType,
				position: node.position,
				data: updatedData,
				parentId,
				locked: newLocked,
				measured: measured ?? node.measured,
				...(supportVisualState && { visualState: newVisualState })
			})
		},
		onSuccess: (_, variables) => {
			setNodeName(variables.newName)
			setIsLocked(variables.newLocked)
			setInitialLocked(variables.newLocked)
			if (supportVisualState && variables.newVisualState !== undefined) {
				setVisualState(variables.newVisualState)
				setInitialVisualState(variables.newVisualState)
			}
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
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
		let visualStateChanged = false
		if (supportVisualState) {
			const currentStatus = newVisualState?.status || 'normal'
			const originalStatus = initialVisualState?.status || 'normal'
			visualStateChanged = currentStatus !== originalStatus
		}

		if (nameChanged || lockChanged || visualStateChanged) {
			updateNode({
				newName,
				newLocked,
				newVisualState: supportVisualState
					? newVisualState || visualState
					: undefined
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
				...(supportVisualState && { visualState: visualState })
			}
			return NodeService.update(id, {
				...node,
				id,
				type: nodeType,
				position: node.position,
				data: updatedData,
				parentId,
				locked: newLocked,
				...(supportVisualState && { visualState: visualState })
			})
		},
		onSuccess: () => {
			const newLocked = !isLocked
			setIsLocked(newLocked)
			setInitialLocked(newLocked)
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
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

	const { mutate: invalidateParentDataMutation } = useMutation({
		mutationKey: ['invalidateParentData'],
		mutationFn: (parentId: string) => NodeDataService.getNodeData(parentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['currentNodeData'] })
		},
		onError: () => {
			// Silent fail
		}
	})

	const handleClose = () => {
		if (invalidateParentData && parentId) {
			invalidateParentDataMutation(parentId)
		} else {
			queryClient.invalidateQueries({ queryKey: ['currentNodeData'] })
		}
		setOpen(false)
	}

	const handleChangeNodeSize = useDebouncedCallback(
		(event: ResizeDragEvent, params: ResizeParams) => {
			const { width, height } = params
			if (node?.position) {
				updateNode({
					newName: nodeName,
					newLocked: isLocked,
					newVisualState: supportVisualState ? visualState : undefined,
					measured: { width, height }
				})
			}
		},
		500
	)

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
		handleClose,
		handleChangeNodeSize,
		node
	}
}
