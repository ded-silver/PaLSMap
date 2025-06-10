import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactFlowProvider } from '@xyflow/react';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'



import './App.css';
import { Auth } from './app/auth';
import { Header, Sidebar } from './components/layouts';
import Main from './components/layouts/Main/Main';
import { DictionaryPage } from './components/pages';





function App() {
	const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false)

	const toggleSidebar = () => {
		setSidebarOpen(!isSidebarOpen)
	}

	const [client] = useState(
		new QueryClient({
			defaultOptions: {
				queries: {
					refetchOnWindowFocus: false
				}
			}
		})
	)

	return (
		<QueryClientProvider client={client}>
			<Routes>
				<Route
					path='/'
					element={
						<ReactFlowProvider>
							<div className='app-layout'>
								<Header toggleSidebar={toggleSidebar} />
								<div className='content-layout'>
									<Sidebar isOpen={isSidebarOpen} />
									<div style={{ flexGrow: 1 }}>
										<Main isSidebarOpen={isSidebarOpen} />
									</div>
								</div>
							</div>
						</ReactFlowProvider>
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
		</QueryClientProvider>
	)
}

export default App