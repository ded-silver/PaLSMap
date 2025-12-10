import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Tooltip,
	Typography
} from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { NodeHistory } from '../../model/types'
import { ChangesDiff } from '../ChangesDiff/ChangesDiff'
import { getActionIcon } from '../utils/getActionIcon'

import styles from './HistoryDetails.module.css'
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime'
import { MUI_STYLES } from '@/shared/styles/mui-styles'

interface HistoryDetailsProps {
	open: boolean
	history: NodeHistory | null
	onClose: () => void
}

export const HistoryDetails = ({
	open,
	history,
	onClose
}: HistoryDetailsProps) => {
	const { t, i18n } = useTranslation(['node-history', 'common'])
	const [copiedId, setCopiedId] = useState<string | null>(null)

	const {
		icon: ActionIcon,
		color,
		userName,
		relativeTime,
		exactTime
	} = useMemo(() => {
		if (!history) {
			return {
				icon: null,
				color: '',
				userName: '',
				relativeTime: '',
				exactTime: ''
			}
		}

		const actionIcon = getActionIcon(history.actionType)
		const user =
			history.user?.name ||
			history.user?.email ||
			t('messages.unknownUser', { ns: 'node-history' })
		const relative = formatRelativeTime(history.createdAt, t)
		const exact = new Date(history.createdAt).toLocaleString(
			i18n.language === 'ru' ? 'ru-RU' : 'en-US',
			{
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			}
		)

		return {
			icon: actionIcon.icon,
			color: actionIcon.color,
			userName: user,
			relativeTime: relative,
			exactTime: exact
		}
	}, [history, t, i18n.language])

	const handleCopyId = useCallback((entityId: string) => {
		navigator.clipboard.writeText(entityId)
		setCopiedId(entityId)
		setTimeout(() => setCopiedId(null), 2000)
	}, [])

	if (!history || !ActionIcon) {
		return null
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='md'
			fullWidth
			sx={{
				zIndex: 'var(--z-index-dialog-history-details)'
			}}
			PaperProps={{
				sx: MUI_STYLES.dialogPaper
			}}
		>
			<DialogTitle sx={MUI_STYLES.dialogTitlePrimary}>
				<Box className={styles.titleContent}>
					{ActionIcon && (
						<ActionIcon
							sx={{
								color: 'white',
								fontSize: 24,
								mr: 1
							}}
						/>
					)}
					<Typography sx={MUI_STYLES.typography.titleMedium}>
						{t('labels.details', { ns: 'node-history' })}
					</Typography>
				</Box>
				<IconButton
					aria-label='close'
					onClick={onClose}
					sx={MUI_STYLES.iconButtonClosePrimary}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={MUI_STYLES.dialogContent}>
				<Box className={styles.content}>
					<Box className={styles.section}>
						<Typography
							variant='subtitle2'
							className={styles.sectionTitle}
						>
							{t('labels.actionType', { ns: 'node-history' })}
						</Typography>
						<Box className={styles.actionInfo}>
							{ActionIcon && (
								<ActionIcon
									sx={{
										color,
										fontSize: 20,
										mr: 1
									}}
								/>
							)}
							<Typography variant='body2'>
								{t(`actionTypes.${history.actionType}`, {
									ns: 'node-history'
								})}
							</Typography>
						</Box>
					</Box>

					<Divider className={styles.divider} />

					<Box className={styles.section}>
						<Typography
							variant='subtitle2'
							className={styles.sectionTitle}
						>
							{t('labels.entityType', { ns: 'node-history' })}
						</Typography>
						<Typography variant='body2'>
							{t(`entityTypes.${history.entityType}`, {
								ns: 'node-history'
							})}
						</Typography>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								mt: 0.5
							}}
						>
							<Typography
								variant='caption'
								className={styles.entityId}
							>
								{t('labels.entityId', { ns: 'node-history' })}:{' '}
								{history.entityId}
							</Typography>
							<Tooltip
								title={
									copiedId === history.entityId
										? t('info.idCopied', { ns: 'node-history' })
										: t('info.copyId', { ns: 'node-history' })
								}
							>
								<IconButton
									size='small'
									onClick={() => handleCopyId(history.entityId)}
									sx={{ p: 0.5 }}
								>
									<ContentCopyIcon fontSize='small' />
								</IconButton>
							</Tooltip>
						</Box>
					</Box>

					<Divider className={styles.divider} />

					<Box className={styles.section}>
						<Typography
							variant='subtitle2'
							className={styles.sectionTitle}
						>
							{t('labels.user', { ns: 'node-history' })}
						</Typography>
						<Typography variant='body2'>{userName}</Typography>
					</Box>

					<Divider className={styles.divider} />

					<Box className={styles.section}>
						<Typography
							variant='subtitle2'
							className={styles.sectionTitle}
						>
							{t('labels.changeTime', { ns: 'node-history' })}
						</Typography>
						<Typography variant='body2'>{exactTime}</Typography>
						<Typography
							variant='caption'
							className={styles.relativeTime}
						>
							{relativeTime}
						</Typography>
					</Box>

					{history.description && (
						<>
							<Divider className={styles.divider} />
							<Box className={styles.section}>
								<Typography
									variant='subtitle2'
									className={styles.sectionTitle}
								>
									{t('labels.description', { ns: 'node-history' })}
								</Typography>
								<Typography variant='body2'>{history.description}</Typography>
							</Box>
						</>
					)}

					{(history.changes.before || history.changes.after) && (
						<>
							<Divider className={styles.divider} />
							<Box className={styles.section}>
								<Typography
									variant='subtitle2'
									className={styles.sectionTitle}
								>
									{t('labels.changes', { ns: 'node-history' })}
								</Typography>
								<ChangesDiff changes={history.changes} />
							</Box>
						</>
					)}
				</Box>
			</DialogContent>

			<Box className={styles.actions}>
				<Button
					variant='contained'
					onClick={onClose}
				>
					{t('buttons.close', { ns: 'common' })}
				</Button>
			</Box>
		</Dialog>
	)
}
