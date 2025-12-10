import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import {
	Divider,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface ContextMenuPosition {
	x: number
	y: number
}

interface NodeContextMenuProps {
	anchorEl: HTMLElement | null
	open: boolean
	onClose: () => void
	nodeId?: string
	selectedNodeIds: string[]
	clipboard: string[]
	onCopy: (nodeIds: string[]) => void
	onPaste: (position: ContextMenuPosition) => void
	position?: ContextMenuPosition
}

export const NodeContextMenu = ({
	anchorEl,
	open,
	onClose,
	nodeId,
	selectedNodeIds,
	clipboard,
	onCopy,
	onPaste,
	position
}: NodeContextMenuProps) => {
	const { t } = useTranslation(['common', 'nodes'])

	const canCopy = selectedNodeIds.length > 0 || !!nodeId
	const canPaste = clipboard.length > 0 && !!position

	const handleCopy = React.useCallback(() => {
		if (!canCopy) return

		const nodeIdsToCopy =
			selectedNodeIds.length > 0 ? selectedNodeIds : nodeId ? [nodeId] : []

		if (nodeIdsToCopy.length > 0) {
			onCopy(nodeIdsToCopy)
		}
		onClose()
	}, [canCopy, selectedNodeIds, nodeId, onCopy, onClose])

	const handlePaste = React.useCallback(() => {
		if (!canPaste || !position) return

		onPaste(position)
		onClose()
	}, [canPaste, position, onPaste, onClose])

	const menuItems = React.useMemo(() => {
		const items: React.ReactNode[] = []

		items.push(
			<MenuItem
				key='copy'
				onClick={handleCopy}
				disabled={!canCopy}
			>
				<ListItemIcon>
					<ContentCopyIcon fontSize='small' />
				</ListItemIcon>
				<ListItemText>{t('labels.copy', { ns: 'nodes' })}</ListItemText>
			</MenuItem>
		)

		if (canCopy) {
			items.push(<Divider key='divider' />)
		}

		items.push(
			<MenuItem
				key='paste'
				onClick={handlePaste}
				disabled={!canPaste}
			>
				<ListItemIcon>
					<ContentPasteIcon fontSize='small' />
				</ListItemIcon>
				<ListItemText>{t('labels.paste', { ns: 'nodes' })}</ListItemText>
			</MenuItem>
		)

		return items
	}, [canCopy, canPaste, handleCopy, handlePaste, t])

	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			anchorReference={position ? 'anchorPosition' : 'anchorEl'}
			anchorPosition={
				position ? { top: position.y, left: position.x } : undefined
			}
			MenuListProps={{
				autoFocus: false,
				autoFocusItem: false
			}}
		>
			{menuItems}
		</Menu>
	)
}
