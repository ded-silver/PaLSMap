import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DensityMediumIcon from '@mui/icons-material/DensityMedium'
import { Button, IconButton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import styles from './Header.module.css'
import { useUserProfile } from '@/entities/user'
import { BUTTON_STYLES } from '@/shared/styles/tokens'
import { LanguageSwitcher } from '@/shared/ui'
import { PathBreadcrumbs } from '@/widgets/path-breadcrumbs'

interface Props {
	toggleSidebar: () => void
}

export const Header = ({ toggleSidebar }: Props) => {
	const { t } = useTranslation('common')
	const { data: profile } = useUserProfile()
	const navigate = useNavigate()

	const userName = profile?.name ?? null

	return (
		<header className={styles.header}>
			<IconButton
				data-sidebar-toggle
				onClick={toggleSidebar}
				sx={{
					width: 49,
					height: 49,
					background: BUTTON_STYLES.glass.dark.background,
					backdropFilter: BUTTON_STYLES.effects.blur,
					boxShadow: BUTTON_STYLES.effects.shadow,
					color: BUTTON_STYLES.glass.dark.text,
					'&:hover': {
						background: BUTTON_STYLES.glass.dark.hover,
						color: BUTTON_STYLES.glass.dark.textHover
					},
					'& svg': {
						fontSize: '24px',
						opacity: 0.9
					}
				}}
			>
				<DensityMediumIcon />
			</IconButton>

			<div className={styles['breadcrumbs-wrapper']}>
				<PathBreadcrumbs />
			</div>

			<div className={styles['header-actions']}>
				<LanguageSwitcher />

				<Button
					onClick={() => navigate('/profile')}
					startIcon={<AccountCircleIcon />}
					sx={{
						height: 49,
						padding: '8px 16px',
						gap: '6px',
						background: BUTTON_STYLES.glass.dark.background,
						backdropFilter: BUTTON_STYLES.effects.blur,
						boxShadow: BUTTON_STYLES.effects.shadow,
						color: BUTTON_STYLES.glass.dark.text,
						fontSize: '0.875rem',
						lineHeight: 1.5,
						'&:hover': {
							background: BUTTON_STYLES.glass.dark.hover,
							color: BUTTON_STYLES.glass.dark.textHover
						},
						'& svg': {
							fontSize: '16px',
							opacity: 0.9
						}
					}}
				>
					{userName ? userName : t('titles.profile')}
				</Button>
			</div>
		</header>
	)
}
