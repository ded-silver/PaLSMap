import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import styles from './PathBreadcrumbs.module.css'
import { useCountry } from '@/entities/country'
import { usePathArea } from '@/entities/path-area'

export const PathBreadcrumbs = () => {
	const { t } = useTranslation('path-areas')
	const { countryId, areaId } = useParams<{
		countryId?: string
		areaId?: string
	}>()

	const { data: country } = useCountry(countryId || '')
	const { data: area } = usePathArea(areaId || '')

	const breadcrumbs = []

	breadcrumbs.push({
		label: t('labels.countries'),
		path: '/map',
		isActive: !countryId && !areaId
	})

	if (countryId && country) {
		breadcrumbs.push({
			label: country.name,
			path: `/map/${countryId}`,
			isActive: !areaId && !!countryId
		})
	}

	if (areaId && area) {
		breadcrumbs.push({
			label: area.name,
			path: `/map/${countryId}/${areaId}`,
			isActive: true
		})
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
					{index > 0 && <span className={styles.separator}> &gt; </span>}
					{crumb.isActive ? (
						<span className={styles.active}>{crumb.label}</span>
					) : (
						<Link
							to={crumb.path}
							className={styles.link}
						>
							{crumb.label}
						</Link>
					)}
				</span>
			))}
		</nav>
	)
}
