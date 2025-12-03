import { ArrowBack, Home } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import styles from './NotFoundPage.module.css'
import { AppButton } from '@/shared/ui'

export const NotFoundPage = () => {
	const navigate = useNavigate()
	const { t } = useTranslation('not-found')

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.errorCode}>
					<span className={styles.number}>4</span>
					<span className={styles.zero}>0</span>
					<span className={styles.number}>4</span>
				</div>

				<Typography
					variant='h4'
					className={styles.title}
				>
					{t('title')}
				</Typography>

				<Typography
					variant='body1'
					className={styles.description}
				>
					{t('description')}
				</Typography>

				<div className={styles.actions}>
					<AppButton
						variant='primary'
						size='lg'
						startIcon={<Home />}
						onClick={() => navigate('/map')}
					>
						{t('buttons.goHome')}
					</AppButton>
					<AppButton
						variant='secondary'
						size='lg'
						startIcon={<ArrowBack />}
						onClick={() => navigate(-1)}
					>
						{t('buttons.goBack')}
					</AppButton>
				</div>
			</div>

			<div className={styles.background}>
				<div className={styles.circle}></div>
				<div className={styles.circle}></div>
				<div className={styles.circle}></div>
			</div>
		</div>
	)
}
