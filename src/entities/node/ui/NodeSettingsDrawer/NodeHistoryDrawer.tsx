import HistoryIcon from '@mui/icons-material/History'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
	HistoryDetails,
	HistoryList,
	useNodeHistory
} from '@/entities/node-history'
import { AppDrawer } from '@/shared/ui'

interface NodeHistoryDrawerProps {
	open: boolean
	onClose: () => void
	nodeId: string
	nodeName?: string
}

export const NodeHistoryDrawer = ({
	open,
	onClose,
	nodeId,
	nodeName
}: NodeHistoryDrawerProps) => {
	const { t } = useTranslation(['common', 'node-history'])
	const { data: history, isLoading: isHistoryLoading } = useNodeHistory(nodeId)
	const [selectedHistory, setSelectedHistory] = useState<string | null>(null)

	const selectedHistoryItem =
		history?.find(h => h.id === selectedHistory) || null

	return (
		<>
			<AppDrawer
				open={open}
				onClose={onClose}
				title={t('labels.history', { ns: 'node-history' })}
				subtitle={nodeName}
				icon={<HistoryIcon />}
				zIndex='history'
			>
				{isHistoryLoading ? (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							py: 4,
							gap: 2
						}}
					>
						<CircularProgress />
						<Typography
							variant='body2'
							color='text.secondary'
						>
							{t('messages.loading', { ns: 'node-history' })}
						</Typography>
					</Box>
				) : history && history.length > 0 ? (
					<HistoryList
						histories={history}
						onItemClick={historyItem => setSelectedHistory(historyItem.id)}
					/>
				) : (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							py: 4
						}}
					>
						<Typography
							variant='body2'
							color='text.secondary'
						>
							{t('messages.noHistory', { ns: 'node-history' })}
						</Typography>
					</Box>
				)}
			</AppDrawer>

			<HistoryDetails
				open={selectedHistory !== null}
				history={selectedHistoryItem}
				onClose={() => setSelectedHistory(null)}
			/>
		</>
	)
}
