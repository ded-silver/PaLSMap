import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { mapVersionApi } from './api'
import type { CreateMapVersionDto } from './types'

export const useCreateVersion = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (dto: CreateMapVersionDto) => mapVersionApi.createVersion(dto),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['map-versions', 'path-area', variables.pathAreaId]
			})
		}
	})
}

export const useVersionsByPathArea = (pathAreaId: string | undefined) => {
	return useQuery({
		queryKey: ['map-versions', 'path-area', pathAreaId],
		queryFn: () => mapVersionApi.getVersionsByPathArea(pathAreaId!),
		enabled: !!pathAreaId,
		staleTime: 30 * 1000,
		refetchOnWindowFocus: false
	})
}

export const useVersion = (versionId: string | undefined) => {
	return useQuery({
		queryKey: ['map-versions', versionId],
		queryFn: () => mapVersionApi.getVersion(versionId!),
		enabled: !!versionId,
		staleTime: 30 * 1000,
		refetchOnWindowFocus: false
	})
}

export const useRestoreVersion = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (versionId: string) => mapVersionApi.restoreVersion(versionId),
		onSuccess: (_, versionId) => {
			queryClient.invalidateQueries({
				queryKey: ['map-versions']
			})
			queryClient.invalidateQueries({
				queryKey: ['nodes']
			})
			queryClient.invalidateQueries({
				queryKey: ['edges']
			})
		}
	})
}

export const useDeleteVersion = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (versionId: string) => mapVersionApi.deleteVersion(versionId),
		onSuccess: (_, versionId) => {
			queryClient.invalidateQueries({
				queryKey: ['map-versions']
			})
		}
	})
}
