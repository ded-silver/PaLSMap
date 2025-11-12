import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { NodeDataService } from './api'
import type { NodeData } from './types'

export function useGetNodeData(id: string) {
	const { data, isLoading } = useQuery({
		queryKey: ['currentNodeData', id],
		queryFn: () => NodeDataService.getNodeData(id)
	})
	const [items, setItems] = useState<NodeData[]>([])

	useEffect(() => {
		if (data) {
			setItems(data)
		}
	}, [data])
	return { items, setItems, isLoading }
}
