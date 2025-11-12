import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Main from '@/components/layouts/Main/Main'

import { Auth } from '@/pages/auth'
import { DictionaryPage } from '@/pages/dictionary'
import { Header } from '@/widgets/header'
import { Sidebar } from '@/widgets/sidebar'

export const Router = () => {
	const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false)

	const toggleSidebar = () => {
		setSidebarOpen(!isSidebarOpen)
	}

	return (
		<>
			<Routes>
				<Route
					path='/'
					element={
						<div className='app-layout'>
							<Header toggleSidebar={toggleSidebar} />
							<div className='content-layout'>
								<Sidebar isOpen={isSidebarOpen} />
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
								<Sidebar isOpen={isSidebarOpen} />
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
