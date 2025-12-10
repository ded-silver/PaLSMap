import {
	Box,
	Card,
	CardContent,
	Chip,
	IconButton,
	Typography
} from '@mui/material'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { NodeHistory } from '../../model/types'
import { getActionIcon } from '../utils/getActionIcon'

import styles from './HistoryItem.module.css'
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime'

interface HistoryItemProps {
	history: NodeHistory
	onClick?: () => void
}

export const HistoryItem = memo(({ history, onClick }: HistoryItemProps) => {
	const { t } = useTranslation(['node-history', 'common'])

	const {
		icon: ActionIcon,
		color,
		relativeTime,
		userName
	} = useMemo(() => {
		const actionIcon = getActionIcon(history.actionType)
		const relative = formatRelativeTime(history.createdAt, t)
		const user =
			history.user?.name ||
			history.user?.email ||
			t('messages.unknownUser', { ns: 'node-history' })

		return {
			icon: actionIcon.icon,
			color: actionIcon.color,
			relativeTime: relative,
			userName: user
		}
	}, [history.actionType, history.createdAt, history.user, t])

	return (
		<Card
			className={styles.card}
			onClick={onClick}
			sx={{
				cursor: onClick ? 'pointer' : 'default',
				'&:hover': onClick
					? {
							boxShadow: 3,
							transform: 'translateY(-2px)',
							transition: 'all 0.2s ease-in-out'
						}
					: {}
			}}
		>
			<CardContent className={styles.content}>
				<Box className={styles.header}>
					<Box className={styles.iconContainer}>
						<ActionIcon
							sx={{
								color,
								fontSize: 20
							}}
						/>
					</Box>
					<Box className={styles.info}>
						<Box className={styles.topRow}>
							<Chip
								label={t(`actionTypes.${history.actionType}`, {
									ns: 'node-history'
								})}
								size='small'
								sx={{
									backgroundColor: `${color}15`,
									color,
									fontSize: '11px',
									height: '22px',
									fontWeight: 500
								}}
							/>
							<Chip
								label={t(`entityTypes.${history.entityType}`, {
									ns: 'node-history'
								})}
								size='small'
								variant='outlined'
								sx={{
									fontSize: '11px',
									height: '22px'
								}}
							/>
						</Box>
						{history.description && (
							<Typography
								variant='body2'
								className={styles.description}
							>
								{history.description}
							</Typography>
						)}
					</Box>
				</Box>
				<Box className={styles.footer}>
					<Typography
						variant='caption'
						className={styles.user}
					>
						{userName}
					</Typography>
					<Typography
						variant='caption'
						className={styles.time}
					>
						{relativeTime}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	)
})

HistoryItem.displayName = 'HistoryItem'
