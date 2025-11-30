import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DensityMediumIcon from '@mui/icons-material/DensityMedium'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import styles from './Header.module.css'
import { useUserProfile } from '@/entities/user'
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
			<button
				data-sidebar-toggle
				className={styles['toggle-sidebar']}
				onClick={toggleSidebar}
			>
				<DensityMediumIcon />
			</button>

			<div className={styles['breadcrumbs-wrapper']}>
				<PathBreadcrumbs />
			</div>

			<div className={styles['header-actions']}>
				<LanguageSwitcher />

				<button
					className={styles['profile-button']}
					onClick={() => navigate('/profile')}
				>
					<AccountCircleIcon />
					{userName ? userName : t('titles.profile')}
				</button>
			</div>
		</header>
	)
}
