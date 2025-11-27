import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import SettingsIcon from '@mui/icons-material/Settings'
import { IconButton, Typography } from '@mui/material'
import { NodeResizer } from '@xyflow/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'
import { NodeSettingsDrawer } from '../NodeSettingsDrawer'

import styles from './SkeletonNode.module.css'
import { type CustomData, useNodeSettings } from '@/entities/node'
import { DialogData } from '@/entities/node-data'

interface Props {
	id: string
	width?: number
	height?: number
	variant:
		| 'OPS'
		| 'TankPark'
		| 'Checkpoint'
		| 'Valve'
		| 'Pump'
		| 'AccountingSystem'
		| 'ChildTankPark'
		| 'PNS'
		| 'MNS'
		| 'SAR'
		| 'FGU'
		| 'KPPSOD'
		| 'Capacity'
		| 'River'
		| 'Factory'
		| 'Object'
		| 'ParentObject'
		| 'ChildObject'
	isName?: boolean
	name?: string
	parentId?: string
	isData?: boolean
	locked?: boolean
	data?: {
		label: string
		measured?: { width: number; height: number }
		tableData?: unknown[]
		handlers?: unknown[]
		[key: string]: unknown
	}
}

interface Props {
	id: string
	width?: number
	height?: number
	variant:
		| 'OPS'
		| 'TankPark'
		| 'Checkpoint'
		| 'Valve'
		| 'Pump'
		| 'AccountingSystem'
		| 'ChildTankPark'
		| 'PNS'
		| 'MNS'
		| 'SAR'
		| 'FGU'
		| 'KPPSOD'
		| 'Capacity'
		| 'River'
		| 'Factory'
		| 'Object'
		| 'ParentObject'
		| 'ChildObject'
	isName?: boolean
	name?: string
	parentId?: string
	isData?: boolean
	locked?: boolean
}

export const SkeletonNode = ({
	id,
	width,
	height,
	variant,
	name,
	parentId,
	isName,
	isData,
	locked = false,
	data: nodeData
}: Props) => {
	const { t } = useTranslation(['common', 'nodes'])

	// Создаем data объект для хука, если его нет
	const dataForHook: CustomData = (
		nodeData
			? {
					...nodeData,
					measured: nodeData.measured ?? {
						width: width ?? 0,
						height: height ?? 0
					},
					tableData: (nodeData.tableData as CustomData['tableData']) ?? [],
					handlers: (nodeData.handlers as CustomData['handlers']) ?? []
				}
			: {
					label: name ?? '',
					measured: { width: width ?? 0, height: height ?? 0 },
					tableData: [],
					handlers: []
				}
	) as CustomData

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
		handleClose,
		handleChangeNodeSize
	} = useNodeSettings({
		id,
		data: dataForHook,
		nodeType: variant,
		parentId,
		supportVisualState: false,
		invalidateParentData: !!parentId,
		initialName: name
	})

	const handleDeleteWithEvent = (
		e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		if (e) {
			e.stopPropagation()
		}
		handleDelete()
	}

	return (
		<>
			{isName ? (
				<Typography
					className={styles.nodeName}
					sx={{ fontSize: '22px', fontFamily: 'inherit' }}
				>
					{nodeName}
				</Typography>
			) : null}
			<div
				className={clsx(styles.node, styles[variant])}
				onClick={handleClickOpen}
			>
				{isAdmin && isName ? (
					<div
						className={styles.settingsButtonWrapper}
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

				{isAdmin && isName ? (
					<div
						className={styles.lockButtonWrapper}
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

				{isAdmin ? (
					<div
						className={styles.deleteButtonWrapper}
						onClick={e => e.stopPropagation()}
					>
						<IconButton
							onClick={e => {
								e.stopPropagation()
								setConfirmOpen(true)
							}}
						>
							<DeleteOutlineIcon fontSize='small' />
						</IconButton>
					</div>
				) : null}
			</div>
			{isAdmin && width && height ? (
				<NodeResizer
					minWidth={width}
					minHeight={height}
					maxHeight={12200}
					maxWidth={12200}
					onResize={(event, params) => handleChangeNodeSize(event, params)}
				/>
			) : null}
			{open && isData ? (
				<DialogData
					open={open}
					handleClose={handleClose}
					dialogName={name ?? t('labels.nameNotSet', { ns: 'nodes' })}
					id={id}
				/>
			) : null}

			<DeleteNodeConfirmDialog
				isOpen={confirmOpen}
				nodeName={nodeName || t('labels.withoutName', { ns: 'nodes' })}
				onClose={() => setConfirmOpen(false)}
				onConfirm={() => {
					handleDeleteWithEvent()
					setConfirmOpen(false)
				}}
			/>

			{isName ? (
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
			) : null}
		</>
	)
}
