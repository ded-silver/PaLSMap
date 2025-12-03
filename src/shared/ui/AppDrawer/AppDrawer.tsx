import CloseIcon from '@mui/icons-material/Close'
import { Box, Drawer, IconButton, Typography } from '@mui/material'
import { ReactNode } from 'react'

import styles from './AppDrawer.module.css'

export type DrawerZIndex = 'settings' | 'history'

interface AppDrawerProps {
	open: boolean
	onClose: () => void
	title: string
	subtitle?: string
	icon?: ReactNode
	children: ReactNode
	zIndex?: DrawerZIndex
	anchor?: 'left' | 'right' | 'top' | 'bottom'
	width?: string | number
	actions?: ReactNode
}

const getZIndex = (zIndex?: DrawerZIndex): number => {
	if (typeof window !== 'undefined') {
		const root = document.documentElement
		const variableName =
			zIndex === 'history'
				? '--z-index-drawer-history'
				: '--z-index-drawer-settings'
		const value = getComputedStyle(root).getPropertyValue(variableName).trim()
		return value ? parseInt(value, 10) : zIndex === 'history' ? 1400 : 1300
	}
	return zIndex === 'history' ? 1400 : 1300
}

export const AppDrawer = ({
	open,
	onClose,
	title,
	subtitle,
	icon,
	children,
	zIndex = 'settings',
	anchor = 'right',
	width = 480,
	actions
}: AppDrawerProps) => {
	const drawerZIndex = getZIndex(zIndex)

	return (
		<Drawer
			anchor={anchor}
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					zIndex: drawerZIndex,
					top: 0,
					height: '100vh',
					margin: 0,
					padding: 0,
					width
				}
			}}
			ModalProps={{
				style: {
					zIndex: drawerZIndex
				}
			}}
		>
			<Box className={styles.container}>
				<Box className={styles.header}>
					<Box className={styles.headerTitle}>
						{icon && <Box className={styles.headerIcon}>{icon}</Box>}
						<Box>
							<Typography
								variant='h6'
								component='h2'
								className={styles.headerText}
							>
								{title}
							</Typography>
							{subtitle && (
								<Typography
									variant='caption'
									className={styles.headerSubtitle}
								>
									{subtitle}
								</Typography>
							)}
						</Box>
					</Box>
					<IconButton
						onClick={onClose}
						size='small'
						className={styles.closeButton}
					>
						<CloseIcon />
					</IconButton>
				</Box>

				<Box className={styles.content}>{children}</Box>
				{actions && <Box className={styles.actions}>{actions}</Box>}
			</Box>
		</Drawer>
	)
}
