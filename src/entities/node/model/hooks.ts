import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { NodeService } from './api'
import type {
	CustomNode,
	DuplicateNodeOptions,
	FlowPosition,
	PasteNodeOptions
} from './types'

export function useNodes(pathAreaId?: string) {
	const { data } = useQuery({
		queryKey: ['nodes', pathAreaId],
		queryFn: () => NodeService.getAll(pathAreaId)
	})

	const [items, setItems] = useState<CustomNode[] | undefined>(data)

	useEffect(() => {
		setItems(data)
	}, [data])
	return { items, setItems }
}

export function useNodesByCountry(countryId: string) {
	const { data } = useQuery({
		queryKey: ['nodes', 'country', countryId],
		queryFn: () => NodeService.getByCountry(countryId),
		enabled: !!countryId
	})

	const [items, setItems] = useState<CustomNode[] | undefined>(data)

	useEffect(() => {
		setItems(data)
	}, [data])
	return { items, setItems }
}

export function useChildNodes(id: string) {
	const { data } = useQuery({
		queryKey: ['childNodes', id],
		queryFn: () => NodeService.getChildren(id)
	})

	const [items, setItems] = useState<CustomNode[] | undefined>(data)

	useEffect(() => {
		setItems(data)
	}, [data])
	return { items, setItems }
}

export function useNodeById(id: string) {
	const { data, isLoading } = useQuery({
		queryKey: ['currentNode', id],
		queryFn: () => NodeService.getById(id)
	})
	const [item, setItem] = useState<CustomNode | undefined>(data)

	useEffect(() => {
		setItem(data)
	}, [data])
	return { item, setItem, isLoading }
}

interface UseDuplicateNodeParams {
	nodeId: string
	options?: DuplicateNodeOptions
}

interface UseDuplicateNodesParams {
	nodeIds: string[]
	options?: DuplicateNodeOptions
}

interface UsePasteNodesParams {
	nodeIds: string[]
	position: FlowPosition
	options?: PasteNodeOptions
}

/**
 * Хук для копирования одной ноды
 */
export function useDuplicateNode() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['duplicateNode'],
		mutationFn: ({ nodeId, options }: UseDuplicateNodeParams) =>
			NodeService.duplicateNode(nodeId, options),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
		}
	})
}

export function useDuplicateNodes() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['duplicateNodes'],
		mutationFn: ({ nodeIds, options }: UseDuplicateNodesParams) =>
			NodeService.duplicateNodes(nodeIds, options),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
		}
	})
}

export function usePasteNodes() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['pasteNodes'],
		mutationFn: ({ nodeIds, position, options }: UsePasteNodesParams) =>
			NodeService.pasteNodes(nodeIds, position, options),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
		}
	})
}
