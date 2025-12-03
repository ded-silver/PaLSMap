import HistoryIcon from '@mui/icons-material/History'
import LockIcon from '@mui/icons-material/Lock'
import PaletteIcon from '@mui/icons-material/Palette'
import SettingsIcon from '@mui/icons-material/Settings'
import {
	Box,
	Button,
	CircularProgress,
	Divider,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Switch,
	TextField,
	Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NodeHistoryDrawer } from './NodeHistoryDrawer'
import styles from './NodeSettingsDrawer.module.css'
import type { VisualState } from '@/entities/node'
import { STATUS_COLORS, getStatusBorderColor } from '@/entities/node'
import {
	HistoryDetails,
	HistoryItem,
	useNodeHistory
} from '@/entities/node-history'
import { AppDrawer } from '@/shared/ui'

interface NodeSettingsDrawerProps {
	open: boolean
	onClose: () => void
	nodeName: string
	editingName: string
	onEditingNameChange: (name: string) => void
	onSave: (
		newName: string,
		newLocked: boolean,
		newVisualState?: VisualState
	) => void
	isAdmin: boolean
	isSaving?: boolean
	isLocked?: boolean
	onLockChange?: (locked: boolean) => void
	visualState?: VisualState
	onVisualStateChange?: (visualState: VisualState) => void
	nodeId?: string
}

export const NodeSettingsDrawer = ({
	open,
	onClose,
	nodeName,
	editingName,
	onEditingNameChange,
	onSave,
	isAdmin,
	isSaving = false,
	isLocked = false,
	onLockChange,
	visualState,
	onVisualStateChange,
	nodeId
}: NodeSettingsDrawerProps) => {
	const { t } = useTranslation(['common', 'nodes', 'node-history'])
	const { data: history, isLoading: isHistoryLoading } = useNodeHistory(
		open && nodeId ? nodeId : ''
	)
	const [selectedHistory, setSelectedHistory] = useState<string | null>(null)
	const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)

	const historyItems = history?.slice(0, 2) || []
	const selectedHistoryItem =
		history?.find(h => h.id === selectedHistory) || null

	const [editingLocked, setEditingLocked] = useState(isLocked)
	const [editingVisualState, setEditingVisualState] = useState<VisualState>(
		visualState || {}
	)
	const [initialVisualState, setInitialVisualState] = useState<
		VisualState | undefined
	>(visualState)

	useEffect(() => {
		if (open) {
			setEditingLocked(isLocked)
			setInitialVisualState(visualState)
			setEditingVisualState(visualState || {})
		}
	}, [open, isLocked])

	const handleCloseDrawer = () => {
		setEditingLocked(isLocked)
		setEditingVisualState(initialVisualState || {})
		onClose()
	}

	const getNormalizedStatus = (vs?: VisualState): string => {
		return vs?.status || 'normal'
	}

	const currentStatus = getNormalizedStatus(editingVisualState)
	const originalStatus = getNormalizedStatus(initialVisualState)

	const statusChanged = onVisualStateChange && currentStatus !== originalStatus

	const hasChanges =
		editingName !== nodeName ||
		(onLockChange && editingLocked !== isLocked) ||
		statusChanged

	const handleStatusChange = (status: string) => {
		const newVisualState: VisualState = {
			status: status as VisualState['status']
		}
		setEditingVisualState(newVisualState)
		if (onVisualStateChange) {
			onVisualStateChange(newVisualState)
		}
	}

	return (
		<>
			<AppDrawer
				open={open}
				onClose={handleCloseDrawer}
				title={t('labels.settings', { ns: 'nodes' })}
				icon={<SettingsIcon />}
				zIndex='settings'
				actions={
					<>
						<Button
							variant='outlined'
							onClick={handleCloseDrawer}
							disabled={isSaving}
						>
							{t('buttons.cancel', { ns: 'common' })}
						</Button>
						<Button
							variant='contained'
							onClick={() => {
								if (onLockChange && editingLocked !== isLocked) {
									onLockChange(editingLocked)
								}
								const visualStateToSave = onVisualStateChange
									? editingVisualState
									: undefined
								onSave(editingName, editingLocked, visualStateToSave)
							}}
							disabled={!isAdmin || !hasChanges || isSaving}
						>
							{isSaving
								? t('messages.saving', { ns: 'common' })
								: t('buttons.save', { ns: 'common' })}
						</Button>
					</>
				}
			>
				<Box className={styles.settingGroup}>
					<Typography
						variant='subtitle2'
						className={styles.label}
					>
						{t('labels.nodeName', { ns: 'nodes' })}
					</Typography>
					<TextField
						fullWidth
						value={editingName}
						onChange={e => onEditingNameChange(e.target.value)}
						placeholder={t('placeholders.nodeName', { ns: 'nodes' })}
						disabled={!isAdmin || isSaving}
						variant='outlined'
						size='small'
						className={styles.textField}
						autoFocus
					/>
					{hasChanges && (
						<Typography
							variant='caption'
							className={styles.hint}
						>
							{t('hints.saveChanges', { ns: 'nodes' })}
						</Typography>
					)}
				</Box>

				{isAdmin && onLockChange ? (
					<>
						<Divider className={styles.sectionDivider} />
						<Box className={styles.settingGroup}>
							<Box className={styles.settingRow}>
								<Box className={styles.settingInfo}>
									<LockIcon className={styles.settingIcon} />
									<Box className={styles.settingText}>
										<Typography
											variant='body2'
											className={styles.settingLabel}
										>
											{t('labels.lockNode', { ns: 'nodes' })}
										</Typography>
										<Typography
											variant='caption'
											className={styles.settingHint}
										>
											{t('hints.lockNode', { ns: 'nodes' })}
										</Typography>
									</Box>
								</Box>
								<Switch
									checked={editingLocked}
									onChange={e => setEditingLocked(e.target.checked)}
									disabled={isSaving}
									color='primary'
								/>
							</Box>
						</Box>
					</>
				) : null}

				{isAdmin && onVisualStateChange ? (
					<>
						<Divider className={styles.sectionDivider} />
						<Box className={styles.settingGroup}>
							<Box className={styles.settingInfo}>
								<PaletteIcon className={styles.settingIcon} />
								<Box className={styles.settingText}>
									<Typography
										variant='body2'
										className={styles.settingLabel}
									>
										{t('labels.visualSettings', { ns: 'nodes' })}
									</Typography>
									<Typography
										variant='caption'
										className={styles.settingHint}
									>
										{t('hints.statusHint', { ns: 'nodes' })}
									</Typography>
								</Box>
							</Box>

							<FormControl
								fullWidth
								variant='outlined'
								size='medium'
								className={styles.textField}
								sx={{ mt: 2 }}
							>
								<InputLabel>{t('labels.status', { ns: 'nodes' })}</InputLabel>
								<Select
									value={editingVisualState.status || 'normal'}
									onChange={e => handleStatusChange(e.target.value)}
									label={t('labels.status', { ns: 'nodes' })}
									disabled={isSaving}
									renderValue={value => {
										const status = value as string
										const color = getStatusBorderColor(status)
										return (
											<Box
												sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
											>
												<Box
													sx={{
														width: 16,
														height: 16,
														borderRadius: '50%',
														backgroundColor: color,
														border: '2px solid',
														borderColor: 'divider',
														flexShrink: 0
													}}
												/>
												{t(`status.${status}`, { ns: 'nodes' })}
											</Box>
										)
									}}
								>
									<MenuItem value='normal'>
										<Box
											sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
										>
											<Box
												sx={{
													width: 16,
													height: 16,
													borderRadius: '50%',
													backgroundColor: STATUS_COLORS.normal.border,
													border: '2px solid',
													borderColor: 'divider'
												}}
											/>
											{t('status.normal', { ns: 'nodes' })}
										</Box>
									</MenuItem>
									<MenuItem value='warning'>
										<Box
											sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
										>
											<Box
												sx={{
													width: 16,
													height: 16,
													borderRadius: '50%',
													backgroundColor: STATUS_COLORS.warning.border,
													border: '2px solid',
													borderColor: 'divider'
												}}
											/>
											{t('status.warning', { ns: 'nodes' })}
										</Box>
									</MenuItem>
									<MenuItem value='error'>
										<Box
											sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
										>
											<Box
												sx={{
													width: 16,
													height: 16,
													borderRadius: '50%',
													backgroundColor: STATUS_COLORS.error.border,
													border: '2px solid',
													borderColor: 'divider'
												}}
											/>
											{t('status.error', { ns: 'nodes' })}
										</Box>
									</MenuItem>
									<MenuItem value='info'>
										<Box
											sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
										>
											<Box
												sx={{
													width: 16,
													height: 16,
													borderRadius: '50%',
													backgroundColor: STATUS_COLORS.info.border,
													border: '2px solid',
													borderColor: 'divider'
												}}
											/>
											{t('status.info', { ns: 'nodes' })}
										</Box>
									</MenuItem>
								</Select>
							</FormControl>
						</Box>
					</>
				) : null}

				{isAdmin && nodeId ? (
					<>
						<Divider className={styles.sectionDivider} />
						<Box className={styles.settingGroup}>
							<Box className={styles.settingInfo}>
								<HistoryIcon className={styles.settingIcon} />
								<Box className={styles.settingText}>
									<Typography
										variant='body2'
										className={styles.settingLabel}
									>
										{t('labels.history', { ns: 'node-history' })}
									</Typography>
									<Typography
										variant='caption'
										className={styles.settingHint}
									>
										{t('labels.recentChanges', { ns: 'node-history' })}
									</Typography>
								</Box>
							</Box>

							{isHistoryLoading ? (
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
										py: 2
									}}
								>
									<CircularProgress size={24} />
								</Box>
							) : historyItems.length > 0 ? (
								<Box className={styles.historyList}>
									{historyItems.map(item => (
										<HistoryItem
											key={item.id}
											history={item}
											onClick={() => setSelectedHistory(item.id)}
										/>
									))}
									<Button
										variant='outlined'
										size='small'
										fullWidth
										onClick={() => setIsHistoryDrawerOpen(true)}
										sx={{ mt: 1 }}
									>
										{t('actions.showAll', { ns: 'node-history' })}
									</Button>
								</Box>
							) : (
								<Typography
									variant='body2'
									color='text.secondary'
									sx={{ py: 2, textAlign: 'center' }}
								>
									{t('messages.noHistory', { ns: 'node-history' })}
								</Typography>
							)}
						</Box>
					</>
				) : null}
			</AppDrawer>

			<HistoryDetails
				open={selectedHistory !== null}
				history={selectedHistoryItem}
				onClose={() => setSelectedHistory(null)}
			/>

			{nodeId && (
				<NodeHistoryDrawer
					open={isHistoryDrawerOpen}
					onClose={() => setIsHistoryDrawerOpen(false)}
					nodeId={nodeId}
					nodeName={nodeName}
				/>
			)}
		</>
	)
}
