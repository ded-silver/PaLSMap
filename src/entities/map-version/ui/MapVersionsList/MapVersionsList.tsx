import { Box, CircularProgress, Typography } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { MapVersionItem } from '../MapVersionItem'

import styles from './MapVersionsList.module.css'
import {
	getErrorMessage,
	getMapVersionUrl,
	useVersionsByPathArea
} from '@/entities/map-version'

interface MapVersionsListProps {
	pathAreaId: string
}

export const MapVersionsList = ({ pathAreaId }: MapVersionsListProps) => {
	const { t } = useTranslation(['map-versions', 'common'])
	const { countryId, areaId } = useParams<{
		countryId?: string
		areaId?: string
	}>()
	const navigate = useNavigate()

	const { data: versions, isLoading, error } = useVersionsByPathArea(pathAreaId)

	const sortedVersions = useMemo(() => {
		if (!versions) return []
		return [...versions].sort((a, b) => {
			const dateA = new Date(a.createdAt).getTime()
			const dateB = new Date(b.createdAt).getTime()
			return dateB - dateA
		})
	}, [versions])

	const handleViewVersion = useCallback(
		(versionId: string) => {
			if (countryId && areaId) {
				navigate(getMapVersionUrl(countryId, areaId, versionId))
			}
		},
		[countryId, areaId, navigate]
	)

	if (isLoading) {
		return (
			<Box className={styles.loading}>
				<CircularProgress />
				<Typography
					variant='body2'
					className={styles.loadingText}
				>
					{t('messages.loadingVersions', { ns: 'map-versions' })}
				</Typography>
			</Box>
		)
	}

	if (error) {
		return (
			<Box className={styles.error}>
				<Typography
					variant='body1'
					color='error'
				>
					{t('messages.error', { ns: 'map-versions' })}
				</Typography>
				<Typography
					variant='body2'
					color='text.secondary'
				>
					{getErrorMessage(
						error,
						t('messages.versionsLoadError', { ns: 'map-versions' })
					)}
				</Typography>
			</Box>
		)
	}

	if (!versions || versions.length === 0) {
		return (
			<Box className={styles.empty}>
				<Typography
					variant='body1'
					color='text.secondary'
				>
					{t('messages.noVersions', { ns: 'map-versions' })}
				</Typography>
			</Box>
		)
	}

	return (
		<Box className={styles.container}>
			<Box className={styles.info}>
				<Typography
					variant='caption'
					color='text.secondary'
				>
					{t('info.totalVersions', {
						ns: 'map-versions',
						count: versions.length
					})}
				</Typography>
			</Box>

			<Box className={styles.list}>
				{sortedVersions.map(version => (
					<MapVersionItem
						key={version.id}
						version={version}
						onView={() => handleViewVersion(version.id)}
					/>
				))}
			</Box>
		</Box>
	)
}
