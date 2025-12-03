import { CircularProgress } from '@mui/material'
import { type ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { userService } from '@/entities/user'
import { resetAuthState } from '@/shared/lib/auth-manager'
import { getAccessToken, hasRefreshTokenCookie } from '@/shared/lib/auth-token'

interface ProtectedRouteProps {
	children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const [isChecking, setIsChecking] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		const checkAuth = async () => {
			const accessToken = getAccessToken()
			const hasRefreshCookie = hasRefreshTokenCookie()

			if (!accessToken && !hasRefreshCookie) {
				setIsAuthenticated(false)
				setIsChecking(false)
				return
			}

			try {
				await userService.getProfile()
				setIsAuthenticated(true)
			} catch (error: any) {
				resetAuthState()
				setIsAuthenticated(false)
			} finally {
				setIsChecking(false)
			}
		}

		void checkAuth()
	}, [])

	if (isChecking) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '100vh',
					width: '100%'
				}}
			>
				<CircularProgress />
			</div>
		)
	}

	if (!isAuthenticated) {
		return (
			<Navigate
				to='/auth'
				replace
			/>
		)
	}

	return <>{children}</>
}
