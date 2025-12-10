import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton, Typography } from '@mui/material'
import { Handle, NodeProps, Position } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'
import { NodeSettingsDrawer } from '../NodeSettingsDrawer'

import styles from './OPSNode.module.css'
import {
	type CustomNode,
	type NodeHandlers,
	getConicGradient,
	getStatusBorderColor,
	useNodeSettings
} from '@/entities/node'
import { DialogData } from '@/entities/node-data'

export const OPSNode = ({ data, id }: NodeProps<CustomNode>) => {
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
		nodeType: 'OPS',
		supportVisualState: true
	})

	return (
		<div className={styles['nodeWrapper']}>
			<div
				className={styles['circle-container']}
				onClick={handleClickOpen}
			>
				<div
					className={styles['circle']}
					style={{
						background: getConicGradient(visualState),
						borderColor: getStatusBorderColor(visualState?.status),
						borderWidth: '1px'
					}}
				>
					<div className={styles['cross']} />
				</div>
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

			<Typography
				className={styles['nodeName']}
				sx={{
					fontSize: '30px',
					fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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

			{isAdmin && data.onCopy ? (
				<div
					className={styles['copyButtonWrapper']}
					onClick={e => e.stopPropagation()}
				>
					<IconButton
						onClick={e => {
							e.stopPropagation()
							data.onCopy?.(id)
						}}
						title={t('labels.copyNode', { ns: 'nodes' })}
					>
						<ContentCopyIcon fontSize='small' />
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

			{open ? (
				<DialogData
					currentNodeType='OPS'
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
				nodeId={id}
			/>
		</div>
	)
}
