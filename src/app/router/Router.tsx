import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AppLayout } from '@/components/layouts/AppLayout'
import Main from '@/components/layouts/Main/Main'

import { Auth } from '@/pages/auth'
import { DictionaryPage } from '@/pages/dictionary'
import { ProfilePage } from '@/pages/profile'

export const Router = () => {
	const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false)
	const location = useLocation()

	const toggleSidebar = () => {
		setSidebarOpen(!isSidebarOpen)
	}

	const closeSidebar = () => {
		setSidebarOpen(false)
	}

	useEffect(() => {
		setSidebarOpen(false)
	}, [location.pathname])

	return (
		<>
			<Routes>
				<Route
					path='/'
					element={
						<AppLayout
							isSidebarOpen={isSidebarOpen}
							toggleSidebar={toggleSidebar}
							closeSidebar={closeSidebar}
						>
							<Main isSidebarOpen={isSidebarOpen} />
						</AppLayout>
					}
				/>
				<Route
					path='/auth'
					element={<Auth />}
				/>
				<Route
					path='/dictionary'
					element={
						<AppLayout
							isSidebarOpen={isSidebarOpen}
							toggleSidebar={toggleSidebar}
							closeSidebar={closeSidebar}
						>
							<DictionaryPage />
						</AppLayout>
					}
				/>
				<Route
					path='/profile'
					element={
						<AppLayout
							isSidebarOpen={isSidebarOpen}
							toggleSidebar={toggleSidebar}
							closeSidebar={closeSidebar}
						>
							<ProfilePage />
						</AppLayout>
					}
				/>
			</Routes>
			<ToastContainer aria-label='asd' />
		</>
	)
}
