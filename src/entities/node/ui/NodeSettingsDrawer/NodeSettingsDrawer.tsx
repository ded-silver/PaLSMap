import CloseIcon from '@mui/icons-material/Close'
import SettingsIcon from '@mui/icons-material/Settings'
import {
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	TextField,
	Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import styles from './NodeSettingsDrawer.module.css'

interface NodeSettingsDrawerProps {
	open: boolean
	onClose: () => void
	nodeName: string
	editingName: string
	onEditingNameChange: (name: string) => void
	onSave: () => void
	isAdmin: boolean
	isSaving?: boolean
}

export const NodeSettingsDrawer = ({
	open,
	onClose,
	nodeName,
	editingName,
	onEditingNameChange,
	onSave,
	isAdmin,
	isSaving = false
}: NodeSettingsDrawerProps) => {
	const { t } = useTranslation(['common', 'nodes'])

	const hasChanges = editingName !== nodeName

	return (
		<Drawer
			anchor='right'
			open={open}
			onClose={onClose}
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
				<Divider className={styles.divider} />

				<Box className={styles.content}>
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
							Измените название и нажмите «Сохранить»
						</Typography>
					)}
				</Box>

				<Box className={styles.actions}>
					<Button
						variant='outlined'
						onClick={onClose}
						disabled={isSaving}
					>
						{t('buttons.cancel', { ns: 'common' })}
					</Button>
					<Button
						variant='contained'
						onClick={onSave}
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
