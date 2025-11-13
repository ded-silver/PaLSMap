import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DensityMediumIcon from '@mui/icons-material/DensityMedium'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './Header.module.css'
import { useUserProfile } from '@/entities/user'
import { LanguageSwitcher } from '@/shared/ui'
import { UserInfoModal } from '@/widgets/user-info-modal'

interface Props {
	toggleSidebar: () => void
}

export const Header = ({ toggleSidebar }: Props) => {
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const { t } = useTranslation('common')
	const { data: profile, isLoading } = useUserProfile()
	const queryClient = useQueryClient()

	const userName = profile?.user?.name ?? profile?.name ?? null

	const handleProfileUpdate = () => {
		queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
	}

	const handleLogout = () => {
		localStorage.removeItem('accessToken')
		window.location.href = '/auth'
	}

	return (
		<header className={styles.header}>
			<button
				className={styles['toggle-sidebar']}
				onClick={toggleSidebar}
			>
				<DensityMediumIcon />
			</button>

			<div className={styles['header-actions']}>
				<LanguageSwitcher />

				<button
					className={styles['profile-button']}
					onClick={() => setIsProfileOpen(true)}
				>
					<AccountCircleIcon style={{ marginRight: '8px' }} />
					{userName ? userName : t('titles.profile')}
				</button>
			</div>

			{isProfileOpen && (
				<UserInfoModal
					onClose={() => setIsProfileOpen(false)}
					onLogout={handleLogout}
					onProfileUpdate={handleProfileUpdate}
				/>
			)}
		</header>
	)
}
