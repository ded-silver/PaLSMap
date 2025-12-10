import { Box, CircularProgress, Pagination, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import type { NodeHistory } from '../../model/types'
import { HistoryItem } from '../HistoryItem'

import styles from './HistoryList.module.css'

interface HistoryListProps {
	histories: NodeHistory[]
	isLoading?: boolean
	error?: Error | null
	total?: number
	page?: number
	limit?: number
	onPageChange?: (page: number) => void
	onItemClick?: (history: NodeHistory) => void
}

export const HistoryList = ({
	histories,
	isLoading = false,
	error = null,
	total,
	page = 1,
	limit = 20,
	onPageChange,
	onItemClick
}: HistoryListProps) => {
	const { t } = useTranslation(['node-history', 'common'])

	const actualTotal = total ?? histories.length
	const totalPages = Math.ceil(actualTotal / limit)

	const hasActiveFilters =
		actualTotal === 0 && histories.length === 0 && !isLoading

	if (isLoading) {
		return (
			<Box className={styles.loading}>
				<CircularProgress />
				<Typography
					variant='body2'
					className={styles.loadingText}
				>
					{t('messages.loading', { ns: 'node-history' })}
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
					{t('messages.error', { ns: 'node-history' })}
				</Typography>
				<Typography
					variant='body2'
					color='text.secondary'
				>
					{error.message}
				</Typography>
			</Box>
		)
	}

	return (
		<Box className={styles.container}>
			{histories.length > 0 && (
				<Box className={styles.info}>
					<Typography
						variant='caption'
						color='text.secondary'
					>
						{total !== undefined
							? t('info.showingResults', {
									ns: 'node-history',
									from: (page - 1) * limit + 1,
									to: Math.min(page * limit, actualTotal),
									total: actualTotal
								})
							: t('info.totalResults', {
									ns: 'node-history',
									total: actualTotal
								})}
					</Typography>
				</Box>
			)}

			{histories.length === 0 && !isLoading && (
				<Box className={styles.empty}>
					<Typography
						variant='body1'
						color='text.secondary'
					>
						{hasActiveFilters
							? t('messages.noResults', { ns: 'common' })
							: t('messages.noHistory', { ns: 'node-history' })}
					</Typography>
				</Box>
			)}

			{histories.length > 0 && (
				<>
					<Box className={styles.list}>
						{histories.map(history => (
							<HistoryItem
								key={history.id}
								history={history}
								onClick={() => onItemClick?.(history)}
							/>
						))}
					</Box>

					{totalPages > 1 && onPageChange && (
						<Box className={styles.pagination}>
							<Pagination
								count={totalPages}
								page={page}
								onChange={(_, newPage) => onPageChange(newPage)}
								color='primary'
								showFirstButton
								showLastButton
							/>
						</Box>
					)}
				</>
			)}
		</Box>
	)
}
