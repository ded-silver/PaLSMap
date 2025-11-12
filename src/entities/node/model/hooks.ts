import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { NodeService } from './api'
import type { CustomNode } from './types'

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
