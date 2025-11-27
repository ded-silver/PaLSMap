import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton, Typography } from '@mui/material'
import { NodeProps } from '@xyflow/react'
import { useTranslation } from 'react-i18next'

import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'
import { NodeSettingsDrawer } from '../NodeSettingsDrawer'

import styles from './River.module.css'
import { type CustomNode, useNodeSettings } from '@/entities/node'
import { DialogData } from '@/entities/node-data'

export const River = ({ data, id }: NodeProps<CustomNode>) => {
	const { t } = useTranslation(['common', 'nodes'])

	const {
		nodeName,
		drawerOpen,
		setDrawerOpen,
		editingName,
		setEditingName,
		isLocked,
		open,
		setOpen,
		isSaving,
		isTogglingLock,
		isAdmin,
		confirmOpen,
		setConfirmOpen,
		handleLockChange,
		handleLockToggle,
		handleSaveFromDrawer,
		handleDelete,
		handleCloseDrawer,
		handleClickOpen,
		handleClose
	} = useNodeSettings({
		id,
		data,
		nodeType: 'River',
		supportVisualState: false
	})

	return (
		<div className={styles['nodeName']}>
			<Typography
				sx={{
					position: 'absolute',
					top: 'calc(10% - 55px)',
					left: '50%',
					transform: 'translateX(-50%) rotate(60deg)',
					transformOrigin: 'center',
					backgroundColor: 'transparent',
					color: 'inherit',
					textAlign: 'center',
					fontSize: '30px',
					whiteSpace: 'nowrap'
				}}
			>
				{nodeName}
			</Typography>
			{isAdmin ? (
				<div
					className={styles['settingsButtonWrapper']}
					onClick={e => e.stopPropagation()}
					onMouseDown={e => e.stopPropagation()}
				>
					<IconButton
						onClick={e => {
							e.stopPropagation()
							e.preventDefault()
							setEditingName(nodeName)
							setDrawerOpen(true)
						}}
						onMouseDown={e => {
							e.stopPropagation()
							e.preventDefault()
						}}
					>
						<SettingsIcon fontSize='small' />
					</IconButton>
				</div>
			) : null}

			{isAdmin ? (
				<div
					className={styles['lockButtonWrapper']}
					onClick={e => e.stopPropagation()}
					onMouseDown={e => e.stopPropagation()}
				>
					<IconButton
						onClick={e => {
							e.stopPropagation()
							e.preventDefault()
							handleLockToggle()
						}}
						onMouseDown={e => {
							e.stopPropagation()
							e.preventDefault()
						}}
						disabled={isTogglingLock}
						title={
							isLocked
								? t('labels.unlock', { ns: 'nodes' })
								: t('labels.lock', { ns: 'nodes' })
						}
					>
						{isLocked ? (
							<LockIcon fontSize='small' />
						) : (
							<LockOpenIcon fontSize='small' />
						)}
					</IconButton>
				</div>
			) : null}

			<div
				className={styles['deleteButtonWrapper']}
				onClick={e => e.stopPropagation()}
			>
				{isAdmin ? (
					<IconButton
						onClick={() => {
							setConfirmOpen(true)
						}}
					>
						<DeleteOutlineIcon fontSize='small' />
					</IconButton>
				) : null}
			</div>
			<div
				onClick={handleClickOpen}
				style={{ transform: 'rotate(60deg)', cursor: 'pointer' }}
			>
				<svg
					width='650'
					height='50'
					viewBox='0 0 650 50'
					xmlns='http://www.w3.org/2000/svg'
					style={{ display: 'block' }}
				>
					<path
						d='M0,25 
         C40,5 80,45 120,25 
         C160,5 200,45 240,25 
         C280,5 320,45 360,25 
         C400,5 440,45 480,25 
         C520,5 560,45 600,25 
         C620,15 640,35 650,25'
						fill='none'
						stroke='rgba(14, 165, 233, 0.7)'
						strokeWidth='8'
						strokeLinecap='round'
					/>
				</svg>
			</div>
			<DeleteNodeConfirmDialog
				isOpen={confirmOpen}
				nodeName={nodeName || t('labels.withoutName', { ns: 'nodes' })}
				onClose={() => setConfirmOpen(false)}
				onConfirm={() => {
					handleDelete()
					setConfirmOpen(false)
				}}
			/>

			<NodeSettingsDrawer
				open={drawerOpen}
				onClose={handleCloseDrawer}
				nodeName={nodeName}
				editingName={editingName}
				onEditingNameChange={setEditingName}
				onSave={handleSaveFromDrawer}
				isAdmin={isAdmin}
				isSaving={isSaving}
				isLocked={isLocked}
				onLockChange={handleLockChange}
			/>
		</div>
	)
}
