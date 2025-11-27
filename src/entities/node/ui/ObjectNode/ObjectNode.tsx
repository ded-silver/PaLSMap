import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton, Typography } from '@mui/material'
import { Handle, NodeProps, Position } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'

import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'
import { NodeSettingsDrawer } from '../NodeSettingsDrawer'

import styles from './ObjectNode.module.css'
import {
	type CustomNode,
	type NodeHandlers,
	useNodeSettings
} from '@/entities/node'
import { DialogData } from '@/entities/node-data'

export const ObjectNode = ({ data, id, parentId }: NodeProps<CustomNode>) => {
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
		nodeType: 'Object',
		parentId,
		supportVisualState: false
	})

	return (
		<div
			className={styles['nodeName']}
			style={{ position: 'relative' }}
		>
			<Typography
				sx={{
					position: 'absolute',
					top: '30%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					color: 'inherit',
					textAlign: 'center',
					fontSize: '15px',
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
				>
					<IconButton
						onClick={() => {
							setEditingName(nodeName)
							setDrawerOpen(true)
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
				>
					<IconButton
						onClick={handleLockToggle}
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

			{isAdmin ? (
				<div
					className={styles['deleteButtonWrapper']}
					onClick={e => e.stopPropagation()}
				>
					<IconButton onClick={() => setConfirmOpen(true)}>
						<DeleteOutlineIcon fontSize='small' />
					</IconButton>
				</div>
			) : null}
			<div
				className={styles['container']}
				onClick={handleClickOpen}
			>
				<div className={styles['cube']} />
				{data.handlers.map((h: NodeHandlers) => (
					<div key={nanoid()}>
						<Handle
							type={h.type}
							id={h.id}
							position={h.type === 'source' ? Position.Left : Position.Right}
						/>
					</div>
				))}
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
			/>
		</div>
	)
}
