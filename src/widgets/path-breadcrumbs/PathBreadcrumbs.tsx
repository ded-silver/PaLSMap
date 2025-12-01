import PublicIcon from '@mui/icons-material/Public'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'

import styles from './PathBreadcrumbs.module.css'
import { useCountry } from '@/entities/country'
import { usePathArea } from '@/entities/path-area'

export const PathBreadcrumbs = () => {
	const { t } = useTranslation('path-areas')
	const location = useLocation()
	const { countryId, areaId } = useParams<{
		countryId?: string
		areaId?: string
	}>()

	const isMapPage =
		location.pathname.startsWith('/map') || location.pathname === '/'

	const { data: country } = useCountry(isMapPage && countryId ? countryId : '')
	const { data: area } = usePathArea(isMapPage && areaId ? areaId : '')

	const breadcrumbs = useMemo(() => {
		if (!isMapPage) {
			return []
		}

		const crumbs = []

		crumbs.push({
			label: t('labels.countries'),
			path: '/map',
			isActive: !countryId && !areaId
		})

		if (countryId && country) {
			crumbs.push({
				label: country.name,
				path: `/map/${countryId}`,
				isActive: !areaId && !!countryId
			})
		}

		if (areaId && area) {
			crumbs.push({
				label: area.name,
				path: `/map/${countryId}/${areaId}`,
				isActive: true
			})
		}

		return crumbs
	}, [isMapPage, countryId, areaId, country, area, t])

	if (!isMapPage) {
		return null
	}

	return (
		<nav
			className={styles.breadcrumbs}
			aria-label='breadcrumb'
		>
			{breadcrumbs.map((crumb, index) => (
				<span
					key={crumb.path}
					className={styles.breadcrumbItem}
				>
					{index > 0 && (
						<span
							className={styles.separator}
							aria-hidden='true'
						>
							<svg
								width='16'
								height='16'
								viewBox='0 0 16 16'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M6 12L10 8L6 4'
									stroke='currentColor'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</span>
					)}
					{crumb.isActive ? (
						<span className={styles.active}>
							{index === 0 && <PublicIcon className={styles.breadcrumbIcon} />}
							{crumb.label}
						</span>
					) : (
						<Link
							to={crumb.path}
							className={styles.link}
						>
							{index === 0 && <PublicIcon className={styles.breadcrumbIcon} />}
							{crumb.label}
						</Link>
					)}
				</span>
			))}
		</nav>
	)
}
