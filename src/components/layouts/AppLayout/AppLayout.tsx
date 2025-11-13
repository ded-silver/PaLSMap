import { Box } from '@mui/material'
import { ReactNode } from 'react'

import { MUI_STYLES } from '@/shared/styles/constants'
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
	return (
		<div className='app-layout'>
			<Header toggleSidebar={toggleSidebar} />
			<div className='content-layout'>
				<Sidebar
					isOpen={isSidebarOpen}
					onClose={closeSidebar}
				/>
				<Box sx={MUI_STYLES.flexGrow}>{children}</Box>
			</div>
		</div>
	)
}
