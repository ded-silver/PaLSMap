import { Box } from '@mui/material'
import { ReactNode, useEffect, useRef } from 'react'

import { MUI_STYLES } from '@/shared/styles/mui-styles'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'

interface AppLayoutProps {
	children: ReactNode
	isSidebarOpen: boolean
	toggleSidebar: () => void
	closeSidebar: () => void
}

export const AppLayout = ({
	children,
	isSidebarOpen,
	toggleSidebar,
	closeSidebar
}: AppLayoutProps) => {
	const sidebarRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!isSidebarOpen) return

		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			if (
				target.closest('[data-sidebar-toggle]') ||
				(sidebarRef.current && sidebarRef.current.contains(target))
			) {
				return
			}
			closeSidebar()
		}

		document.addEventListener('mousedown', handleClick)
		return () => document.removeEventListener('mousedown', handleClick)
	}, [isSidebarOpen, closeSidebar])

	return (
		<div className='app-layout'>
			<Header toggleSidebar={toggleSidebar} />
			<div className='content-layout'>
				<div ref={sidebarRef}>
					<Sidebar
						isOpen={isSidebarOpen}
						onClose={closeSidebar}
					/>
				</div>
				<Box sx={MUI_STYLES.flexGrow}>{children}</Box>
			</div>
		</div>
	)
}
