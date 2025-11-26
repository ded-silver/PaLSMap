import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton, Typography } from '@mui/material'
import { Handle, NodeProps, Position } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { CSSProperties, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'
import { NodeSettingsDrawer } from '../NodeSettingsDrawer'

import styles from './CheckpointNode.module.css'
import {
	type CustomNode,
	type NodeHandlers,
	getCylinderBackground,
	getStatusBorderColor,
	useNodeSettings
} from '@/entities/node'
import { DialogData } from '@/entities/node-data'

export const CheckpointNode = ({ data, id }: NodeProps<CustomNode>) => {
	const { t } = useTranslation(['common', 'nodes'])

	const {
		nodeName,
		setNodeName,
		drawerOpen,
		setDrawerOpen,
		editingName,
		setEditingName,
		isLocked,
		visualState,
		confirmOpen,
		setConfirmOpen,
		open,
		isSaving,
		isTogglingLock,
		isAdmin,
		handleLockChange,
		handleLockToggle,
		handleVisualStateChange,
		handleSaveFromDrawer,
		handleDelete,
		handleCloseDrawer,
		handleClickOpen,
		handleClose
	} = useNodeSettings({
		id,
		data,
		nodeType: 'Checkpoint'
	})

	return (
		<div className={styles['nodeName']}>
			<Typography
				sx={{
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
						disabled={isSaving || isTogglingLock}
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
				<div
					className={styles['circle']}
					style={
						visualState?.status && visualState.status !== 'normal'
							? ({
									backgroundColor: getCylinderBackground(visualState),
									borderColor: getStatusBorderColor(visualState?.status),
									borderWidth: '1px'
								} as CSSProperties)
							: undefined
					}
				/>
				{data.handlers.map((h: NodeHandlers) => (
					<div key={nanoid()}>
						<Handle
							type={h.type}
							id={h.id}
							position={h.type === 'source' ? Position.Right : Position.Left}
						/>
					</div>
				))}
			</div>
			{open ? (
				<DialogData
					currentNodeType='Checkpoint'
					dialogName={data.label}
					open={open}
					handleClose={handleClose}
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
				visualState={visualState}
				onVisualStateChange={handleVisualStateChange}
			/>
		</div>
	)
}
