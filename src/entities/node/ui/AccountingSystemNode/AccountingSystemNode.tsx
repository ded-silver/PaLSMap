import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { IconButton } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NodeProps, useReactFlow } from '@xyflow/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { DeleteNodeConfirmDialog } from '../DeleteNodeConfirmDialog'

import styles from './AccountingSystemNode.module.css'
import { type CustomNode, type NodeDto, NodeService } from '@/entities/node'
import { DialogData, NodeDataService } from '@/entities/node-data'
import { useIsAdmin } from '@/entities/user'
import { useDebouncedCallback } from '@/shared/hooks'

export const AccountingSystemNode = ({
	data,
	id,
	parentId
}: NodeProps<CustomNode>) => {
	const { t } = useTranslation(['common', 'nodes'])
	const [open, setOpen] = useState(false)
	const { getNode } = useReactFlow()
	const queryClient = useQueryClient()
	const [nodeName, setNodeName] = useState<string>(data.label)
	const node = getNode(id)

	const isAdmin = useIsAdmin()

	const [confirmOpen, setConfirmOpen] = useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const { mutate: invalidateParentData } = useMutation({
		mutationKey: ['invalidateParentData'],
		mutationFn: (parentId: string) => NodeDataService.getNodeData(parentId),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['currentNodeData'] })
		},
		onError(error: unknown) {
			toast.error(t('messages.deleteError', { ns: 'nodes' }))
		}
	})

	const handleClose = () => {
		if (parentId) {
			invalidateParentData(parentId)
		}
		setOpen(false)
	}

	const { mutate: deleteNode } = useMutation({
		mutationKey: ['deleteNode'],
		mutationFn: (nodeId: string) => NodeService.delete(nodeId),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
		},
		onError(error: unknown) {
			toast.error(t('messages.deleteError', { ns: 'nodes' }))
		}
	})

	const { mutate: updateCurrentNode } = useMutation({
		mutationKey: ['updateCurrentNode'],
		mutationFn: (data: NodeDto) =>
			NodeService.update(data.id, {
				...data,
				data: {
					...data.data,
					label: nodeName
				},
				parentId
			}),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
		},
		onError: error => {
			toast.error(t('messages.updateDataError', { ns: 'nodes' }))
		}
	})

	const handleDelete = () => {
		deleteNode(id)
	}

	const handleChangeNodeName = useDebouncedCallback((text: string) => {
		if (node?.position) {
			updateCurrentNode({
				...node,
				id,
				type: 'AccountingSystem',
				position: node?.position,
				data
			})
		}
	}, 500)

	return (
		<div
			className={styles['nodeName']}
			style={{ position: 'relative' }}
		>
			<input
				value={nodeName}
				placeholder={t('placeholders.nodeName', { ns: 'nodes' })}
				readOnly={!isAdmin}
				onChange={e => {
					if (isAdmin) {
						setNodeName(e.target.value)
						handleChangeNodeName()
					}
				}}
				style={{
					position: 'absolute',
					top: 'calc(5% - 20px)',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					backgroundColor: 'transparent',
					border: 'none',
					outline: 'none',
					color: 'inherit',
					textAlign: 'center',
					fontSize: '22px',
					pointerEvents: 'auto',
					zIndex: '1003'
				}}
			/>
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
				className={styles.container}
				onClick={handleClickOpen}
			>
				<div className={styles.innerCircle} />
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
		</div>
	)
}
