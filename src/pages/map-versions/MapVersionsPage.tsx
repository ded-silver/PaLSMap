import HistoryIcon from '@mui/icons-material/History'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import styles from './MapVersionsPage.module.css'
import { MapVersionsList, getMapVersionUrl } from '@/entities/map-version'
import { AppButton } from '@/shared/ui'

export const MapVersionsPage = () => {
	const { t } = useTranslation(['map-versions', 'common'])
	const { countryId, areaId } = useParams<{
		countryId?: string
		areaId?: string
	}>()
	const navigate = useNavigate()

	if (!areaId || !countryId) {
		return (
			<div className={styles.container}>
				<Typography color='error'>
					{t('messages.areaIdRequired', { ns: 'map-versions' })}
				</Typography>
			</div>
		)
	}

	const handleBackToMap = () => {
		navigate(getMapVersionUrl(countryId, areaId))
	}

	return (
		<div className={styles.container}>
			<div className={styles.contentWrapper}>
				<div className={styles.header}>
					<div className={styles.titleSection}>
						<HistoryIcon className={styles.headerIcon} />
						<Typography
							variant='h4'
							component='h1'
							className={styles.title}
						>
							{t('labels.versionTitle', { ns: 'map-versions' })}
						</Typography>
					</div>
					<AppButton
						variant='secondary'
						onClick={handleBackToMap}
					>
						{t('labels.backToMap', { ns: 'map-versions' })}
					</AppButton>
				</div>

				<Box className={styles.content}>
					<MapVersionsList pathAreaId={areaId} />
				</Box>
			</div>
		</div>
	)
}
