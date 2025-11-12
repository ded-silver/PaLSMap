import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Main from '@/components/layouts/Main/Main'

import { Auth } from '@/pages/auth'
import { DictionaryPage } from '@/pages/dictionary'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'

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
						<div className='app-layout'>
							<Header toggleSidebar={toggleSidebar} />
							<div className='content-layout'>
								<Sidebar
									isOpen={isSidebarOpen}
									onClose={closeSidebar}
								/>
								<div style={{ flexGrow: 1 }}>
									<Main isSidebarOpen={isSidebarOpen} />
								</div>
							</div>
						</div>
					}
				/>
				<Route
					path='/auth'
					element={<Auth />}
				/>
				<Route
					path='/dictionary'
					element={
						<div className='app-layout'>
							<Header toggleSidebar={toggleSidebar} />
							<div className='content-layout'>
								<Sidebar
									isOpen={isSidebarOpen}
									onClose={closeSidebar}
								/>
								<div style={{ flexGrow: 1 }}>
									<DictionaryPage />
								</div>
							</div>
						</div>
					}
				/>
			</Routes>
			<ToastContainer aria-label='asd' />
		</>
	)
}
