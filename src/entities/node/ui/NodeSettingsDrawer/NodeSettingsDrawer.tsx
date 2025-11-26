import CloseIcon from '@mui/icons-material/Close'
import LockIcon from '@mui/icons-material/Lock'
import SettingsIcon from '@mui/icons-material/Settings'
import {
	Box,
	Button,
	Divider,
	Drawer,
	FormControlLabel,
	IconButton,
	Switch,
	TextField,
	Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './NodeSettingsDrawer.module.css'

interface NodeSettingsDrawerProps {
	open: boolean
	onClose: () => void
	nodeName: string
	editingName: string
	onEditingNameChange: (name: string) => void
	onSave: (newName: string, newLocked: boolean) => void
	isAdmin: boolean
	isSaving?: boolean
	isLocked?: boolean
	onLockChange?: (locked: boolean) => void
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
	onLockChange
}: NodeSettingsDrawerProps) => {
	const { t } = useTranslation(['common', 'nodes'])

	const [editingLocked, setEditingLocked] = useState(isLocked)

	useEffect(() => {
		if (open) {
			setEditingLocked(isLocked)
		}
	}, [open, isLocked])

	const handleCloseDrawer = () => {
		setEditingLocked(isLocked)
		onClose()
	}

	const hasChanges =
		editingName !== nodeName || (onLockChange && editingLocked !== isLocked)

	return (
		<Drawer
			anchor='right'
			open={open}
			onClose={handleCloseDrawer}
			PaperProps={{
				sx: {
					zIndex: 1300,
					top: 0,
					height: '100vh',
					margin: 0,
					padding: 0
				}
			}}
			ModalProps={{
				style: {
					zIndex: 1300
				}
			}}
		>
			<Box className={styles.container}>
				<Box className={styles.header}>
					<Box className={styles.headerTitle}>
						<SettingsIcon className={styles.headerIcon} />
						<Typography
							variant='h6'
							component='h2'
							className={styles.headerText}
						>
							{t('labels.settings', { ns: 'nodes' })}
						</Typography>
					</Box>
					<IconButton
						onClick={onClose}
						size='small'
						className={styles.closeButton}
					>
						<CloseIcon />
					</IconButton>
				</Box>

				<Box className={styles.content}>
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
				</Box>

				<Box className={styles.actions}>
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
							onSave(editingName, editingLocked)
						}}
						disabled={!isAdmin || !hasChanges || isSaving}
					>
						{isSaving
							? t('messages.saving', { ns: 'common' })
							: t('buttons.save', { ns: 'common' })}
					</Button>
				</Box>
			</Box>
		</Drawer>
	)
}
