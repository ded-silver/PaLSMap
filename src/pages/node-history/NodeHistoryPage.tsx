import { Box, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import styles from './NodeHistoryPage.module.css'
import {
	HistoryDetails,
	HistoryFilters,
	type HistoryFiltersParams,
	HistoryList,
	useHistory
} from '@/entities/node-history'
import { MUI_STYLES } from '@/shared/styles/constants'

export const NodeHistoryPage = () => {
	const { t } = useTranslation(['node-history', 'common'])
	const [searchParams, setSearchParams] = useSearchParams()

	const [filters, setFilters] = useState<HistoryFiltersParams>(() => {
		const nodeId = searchParams.get('nodeId')
		return {
			page: 1,
			limit: 20,
			...(nodeId && { nodeId })
		}
	})

	const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
		null
	)

	const { data, isLoading, error } = useHistory(filters)

	const historyList = useMemo(() => data?.data || [], [data?.data])
	const total = data?.total || 0
	const currentPage = data?.page || 1
	const limit = data?.limit || 20

	const selectedHistoryItem = useMemo(
		() => historyList.find(h => h.id === selectedHistoryId),
		[historyList, selectedHistoryId]
	)

	const handleFiltersChange = useCallback(
		(newFilters: HistoryFiltersParams) => {
			setFilters(prev => ({ ...newFilters, page: 1 }))
		},
		[]
	)

	const handleResetFilters = useCallback(() => {
		const nodeId = searchParams.get('nodeId')
		const resetFilters: HistoryFiltersParams = {
			page: 1,
			limit: 20,
			...(nodeId && { nodeId })
		}
		setFilters(resetFilters)
	}, [searchParams])

	const handlePageChange = useCallback((page: number) => {
		setFilters(prev => ({ ...prev, page }))
	}, [])

	const handleItemClick = useCallback((history: { id: string }) => {
		setSelectedHistoryId(history.id)
	}, [])

	const handleCloseDetails = useCallback(() => {
		setSelectedHistoryId(null)
	}, [])

	return (
		<Box
			sx={{
				height: '100%',
				overflowY: 'auto',
				backgroundColor: '#e6f0ff',
				width: '100%'
			}}
		>
			<div className={styles.container}>
				<Typography
					sx={MUI_STYLES.typography.titleLarge}
					className={styles.title}
					gutterBottom
				>
					{t('labels.history', { ns: 'node-history' })}
				</Typography>

				<Box className={styles.content}>
					<HistoryFilters
						filters={filters}
						onFiltersChange={handleFiltersChange}
						onReset={handleResetFilters}
					/>

					<HistoryList
						histories={historyList}
						isLoading={isLoading}
						error={error}
						total={total}
						page={currentPage}
						limit={limit}
						onPageChange={handlePageChange}
						onItemClick={handleItemClick}
					/>
				</Box>

				<HistoryDetails
					open={selectedHistoryId !== null}
					history={selectedHistoryItem || null}
					onClose={handleCloseDetails}
				/>
			</div>
		</Box>
	)
}
