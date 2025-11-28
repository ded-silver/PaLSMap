import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { nodeHistoryApi } from './api'
import type {
	ActionType,
	EntityType,
	HistoryFiltersParams,
	NodeHistory
} from './types'

const serializeFilters = (filters?: HistoryFiltersParams) => {
	if (!filters) return null
	return JSON.stringify(filters, Object.keys(filters).sort())
}

export const useHistory = (filters?: HistoryFiltersParams) => {
	const serializedFilters = useMemo(() => serializeFilters(filters), [filters])

	return useQuery({
		queryKey: ['node-history', 'list', serializedFilters],
		queryFn: () => nodeHistoryApi.getHistory(filters),
		staleTime: 30 * 1000,
		refetchOnWindowFocus: false
	})
}

export const useNodeHistory = (nodeId: string) => {
	return useQuery({
		queryKey: ['node-history', 'node', nodeId],
		queryFn: () => nodeHistoryApi.getNodeHistory(nodeId),
		enabled: !!nodeId,
		staleTime: 30 * 1000,
		refetchOnWindowFocus: false
	})
}

export const useEntityHistory = (entityType: EntityType, entityId: string) => {
	return useQuery({
		queryKey: ['node-history', 'entity', entityType, entityId],
		queryFn: () => nodeHistoryApi.getEntityHistory(entityType, entityId),
		enabled: !!entityType && !!entityId,
		staleTime: 30 * 1000,
		refetchOnWindowFocus: false
	})
}

export const useUserHistory = (userId: string, limit?: number) => {
	return useQuery({
		queryKey: ['node-history', 'user', userId, limit],
		queryFn: () => nodeHistoryApi.getUserHistory(userId, limit),
		enabled: !!userId,
		staleTime: 30 * 1000,
		refetchOnWindowFocus: false
	})
}
