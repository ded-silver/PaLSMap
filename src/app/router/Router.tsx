import { CircularProgress } from '@mui/material'
import { type ReactNode, useEffect, useState } from 'react'
import {
	Navigate,
	Route,
	Routes,
	useLocation,
	useNavigate,
	useSearchParams
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AppLayout } from '@/components/layouts/AppLayout'
import MapView from '@/components/layouts/Main/MapView'

import { useIsAdminWithLoading, userService } from '@/entities/user'
import { AdminUsersPage } from '@/pages/admin-users'
import { Auth } from '@/pages/auth'
import { DictionaryPage } from '@/pages/dictionary'
import { CountriesListPage, PathAreasListPage } from '@/pages/map'
import { NodeHistoryPage } from '@/pages/node-history'
import { ProfilePage } from '@/pages/profile'
import { resetAuthState } from '@/shared/lib/auth-manager'
import { getAccessToken, hasRefreshTokenCookie } from '@/shared/lib/auth-token'

const AdminRoute = ({ children }: { children: ReactNode }) => {
	const { isAdmin, isLoading } = useIsAdminWithLoading()

	if (isLoading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '50vh'
				}}
			>
				<CircularProgress />
			</div>
		)
	}

	if (!isAdmin) {
		return (
			<Navigate
				to='/'
				replace
			/>
		)
	}

	return <>{children}</>
}

const MapCountryRoute = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
	const [searchParams] = useSearchParams()
	const mode = searchParams.get('mode')

	if (mode === 'map') {
		return <MapView isSidebarOpen={isSidebarOpen} />
	}

	return <PathAreasListPage />
}

export const Router = () => {
	const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false)
	const location = useLocation()
	const navigate = useNavigate()

	const toggleSidebar = () => {
		setSidebarOpen(!isSidebarOpen)
	}

	const closeSidebar = () => {
		setSidebarOpen(false)
	}

	useEffect(() => {
		setSidebarOpen(false)
	}, [location.pathname])

	useEffect(() => {
		const bootstrapAuth = async () => {
			const accessToken = getAccessToken()
			const hasRefreshCookie = hasRefreshTokenCookie()

			if (!accessToken && !hasRefreshCookie) return

			try {
				await userService.getProfile()
			} catch {
				resetAuthState()
				navigate('/auth', { replace: true })
			}
		}

		void bootstrapAuth()
	}, [navigate])

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
							<Navigate
								to='/map'
								replace
							/>
						</AppLayout>
					}
				/>
				<Route
					path='/map'
					element={
						<AppLayout
							isSidebarOpen={isSidebarOpen}
							toggleSidebar={toggleSidebar}
							closeSidebar={closeSidebar}
						>
							<CountriesListPage />
						</AppLayout>
					}
				/>
				<Route
					path='/map/:countryId'
					element={
						<AppLayout
							isSidebarOpen={isSidebarOpen}
							toggleSidebar={toggleSidebar}
							closeSidebar={closeSidebar}
						>
							<MapCountryRoute isSidebarOpen={isSidebarOpen} />
						</AppLayout>
					}
				/>
				<Route
					path='/map/:countryId/:areaId'
					element={
						<AppLayout
							isSidebarOpen={isSidebarOpen}
							toggleSidebar={toggleSidebar}
							closeSidebar={closeSidebar}
						>
							<MapView isSidebarOpen={isSidebarOpen} />
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
				<Route
					path='/admin/users'
					element={
						<AppLayout
							isSidebarOpen={isSidebarOpen}
							toggleSidebar={toggleSidebar}
							closeSidebar={closeSidebar}
						>
							<AdminRoute>
								<AdminUsersPage />
							</AdminRoute>
						</AppLayout>
					}
				/>
				<Route
					path='/node-history'
					element={
						<AppLayout
							isSidebarOpen={isSidebarOpen}
							toggleSidebar={toggleSidebar}
							closeSidebar={closeSidebar}
						>
							<AdminRoute>
								<NodeHistoryPage />
							</AdminRoute>
						</AppLayout>
					}
				/>
			</Routes>
			<ToastContainer aria-label='asd' />
		</>
	)
}
