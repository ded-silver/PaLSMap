import { type ReactNode } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { NotFoundPage } from '@/pages/not-found'
import { isValidUUID } from '@/shared/lib/uuid-validator'

interface ValidatedMapRouteProps {
	children: ReactNode
	requiredParams?: ('countryId' | 'areaId')[]
}

export const ValidatedMapRoute = ({
	children,
	requiredParams = ['countryId']
}: ValidatedMapRouteProps) => {
	const params = useParams<{ countryId?: string; areaId?: string }>()

	for (const paramName of requiredParams) {
		const paramValue = params[paramName]
		if (!isValidUUID(paramValue)) {
			return <NotFoundPage />
		}
	}

	return <>{children}</>
}
