import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton, Typography } from '@mui/material'
import { NodeProps } from '@xyflow/react'
import { useTranslation } from 'react-i18next'

import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'
import { NodeSettingsDrawer } from '../NodeSettingsDrawer'

import styles from './ChildTankParkNode.module.css'
import { type CustomNode, useNodeSettings } from '@/entities/node'
import { DialogData } from '@/entities/node-data'

export const ChildTankParkNode = ({
	data,
	id,
	parentId
}: NodeProps<CustomNode>) => {
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
		nodeType: 'ChildTankPark',
		parentId,
		supportVisualState: false,
		invalidateParentData: true
	})

	return (
		<div
			className={styles['nodeName']}
			style={{ position: 'relative' }}
		>
			<Typography
				sx={{
					position: 'absolute',
					top: 'calc(5% - 20px)',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					color: 'inherit',
					textAlign: 'center',
					fontSize: '25px',
					zIndex: '1003',
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
				className={styles['circle-container']}
				onClick={handleClickOpen}
			>
				<div className={styles['chart-cylinder']} />
			</div>
			{open ? (
				<DialogData
					open={open}
					handleClose={handleClose}
					dialogName={data.label}
					id={id}
				/>
			) : null}

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
				nodeId={id}
			/>
		</div>
	)
}
