import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { EdgeDto, EdgeService } from '../../services/edge.service'

export function useEdges() {
	const { data } = useQuery({
		queryKey: ['edges'],
		queryFn: () => EdgeService.getAll()
	})

	const [items, setItems] = useState<EdgeDto[] | undefined>(data)

	useEffect(() => {
		setItems(data)
	}, [data])
	return { items, setItems }
}
