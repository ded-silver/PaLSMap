import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { NodeService } from '../../services/node.service'
import { CustomNode, NodeData } from '../../types/nodeTypes'

export function useNodes() {
	const { data } = useQuery({
		queryKey: ['nodes'],
		queryFn: () => NodeService.getAll()
	})

	const [items, setItems] = useState<CustomNode[] | undefined>(data)

	useEffect(() => {
		setItems(data)
	}, [data])
	return { items, setItems }
}

export function useChildNodes(id: string) {
	const { data } = useQuery({
		queryKey: ['childNodes'],
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
		queryKey: ['currentNode'],
		queryFn: () => NodeService.getById(id)
	})
	const [item, setItem] = useState<CustomNode | undefined>(data)

	useEffect(() => {
		setItem(data)
	}, [data])
	return { item, setItem, isLoading }
}

export function useGetNodeData(id: string) {
	const { data, isLoading } = useQuery({
		queryKey: ['currentNodeData'],
		queryFn: () => NodeService.getNodeData(id)
	})
	const [items, setItems] = useState<NodeData[]>([])

	useEffect(() => {
		if (data) {
			setItems(data)
		}
	}, [data])
	return { items, setItems, isLoading }
}

