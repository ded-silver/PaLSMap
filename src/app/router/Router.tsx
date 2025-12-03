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

import { ProtectedRoute } from './ProtectedRoute'
import { ValidatedMapRoute } from './ValidatedMapRoute'
import { useIsAdminWithLoading, userService } from '@/entities/user'
import { AdminUsersPage } from '@/pages/admin-users'
import { Auth } from '@/pages/auth'
import { DictionaryPage } from '@/pages/dictionary'
import { CountriesListPage, PathAreasListPage } from '@/pages/map'
import { MapVersionsPage } from '@/pages/map-versions'
import { NodeHistoryPage } from '@/pages/node-history'
import { NotFoundPage } from '@/pages/not-found'
import { ProfilePage } from '@/pages/profile'
import { resetAuthState } from '@/shared/lib/auth-manager'
import { getAccessToken, hasRefreshTokenCookie } from '@/shared/lib/auth-token'
import { AppLayout } from '@/shared/ui/layouts/AppLayout'
import { MapView } from '@/widgets/map-view'

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
			} catch (error: any) {
				resetAuthState()
				if (location.pathname !== '/auth') {
					navigate('/auth', { replace: true })
				}
			}
		}

		void bootstrapAuth()
	}, [navigate, location.pathname])

	return (
		<>
			<Routes>
				<Route
					path='/auth'
					element={<Auth />}
				/>
				<Route
					path='/'
					element={
						<ProtectedRoute>
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
						</ProtectedRoute>
					}
				/>
				<Route
					path='/map'
					element={
						<ProtectedRoute>
							<AppLayout
								isSidebarOpen={isSidebarOpen}
								toggleSidebar={toggleSidebar}
								closeSidebar={closeSidebar}
							>
								<CountriesListPage />
							</AppLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/map/:countryId'
					element={
						<ProtectedRoute>
							<ValidatedMapRoute requiredParams={['countryId']}>
								<AppLayout
									isSidebarOpen={isSidebarOpen}
									toggleSidebar={toggleSidebar}
									closeSidebar={closeSidebar}
								>
									<MapCountryRoute isSidebarOpen={isSidebarOpen} />
								</AppLayout>
							</ValidatedMapRoute>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/map/:countryId/:areaId/versions'
					element={
						<ProtectedRoute>
							<ValidatedMapRoute requiredParams={['countryId', 'areaId']}>
								<AppLayout
									isSidebarOpen={isSidebarOpen}
									toggleSidebar={toggleSidebar}
									closeSidebar={closeSidebar}
								>
									<MapVersionsPage />
								</AppLayout>
							</ValidatedMapRoute>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/map/:countryId/:areaId'
					element={
						<ProtectedRoute>
							<ValidatedMapRoute requiredParams={['countryId', 'areaId']}>
								<AppLayout
									isSidebarOpen={isSidebarOpen}
									toggleSidebar={toggleSidebar}
									closeSidebar={closeSidebar}
								>
									<MapView isSidebarOpen={isSidebarOpen} />
								</AppLayout>
							</ValidatedMapRoute>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/dictionary'
					element={
						<ProtectedRoute>
							<AppLayout
								isSidebarOpen={isSidebarOpen}
								toggleSidebar={toggleSidebar}
								closeSidebar={closeSidebar}
							>
								<DictionaryPage />
							</AppLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/profile'
					element={
						<ProtectedRoute>
							<AppLayout
								isSidebarOpen={isSidebarOpen}
								toggleSidebar={toggleSidebar}
								closeSidebar={closeSidebar}
							>
								<ProfilePage />
							</AppLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/admin/users'
					element={
						<ProtectedRoute>
							<AppLayout
								isSidebarOpen={isSidebarOpen}
								toggleSidebar={toggleSidebar}
								closeSidebar={closeSidebar}
							>
								<AdminRoute>
									<AdminUsersPage />
								</AdminRoute>
							</AppLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path='/node-history'
					element={
						<ProtectedRoute>
							<AppLayout
								isSidebarOpen={isSidebarOpen}
								toggleSidebar={toggleSidebar}
								closeSidebar={closeSidebar}
							>
								<AdminRoute>
									<NodeHistoryPage />
								</AdminRoute>
							</AppLayout>
						</ProtectedRoute>
					}
				/>
				<Route
					path='*'
					element={<NotFoundPage />}
				/>
			</Routes>
			<ToastContainer aria-label='asd' />
		</>
	)
}
