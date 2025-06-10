import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DensityMediumIcon from '@mui/icons-material/DensityMedium'
import { useEffect, useState } from 'react'

import { userService } from '../../../services/user.service'
import { UserInfoModal } from '../../UserInfoModal/UserInfoModal'

import styles from './Header.module.css'

interface Props {
	toggleSidebar: () => void
}

export const Header = ({ toggleSidebar }: Props) => {
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const [userName, setUserName] = useState<string | null>(null)

	useEffect(() => {
		const fetchUserName = async () => {
			try {
				const user = await userService.getProfile()
				setUserName(user.name ?? null)
				localStorage.setItem('isAdmin', user.isAdmin.toString())
			} catch (error) {
				console.error('Ошибка при загрузке профиля', error)
				setUserName(null)
			}
		}

		fetchUserName()
	}, [])

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

			<button
				className={styles['profile-button']}
				onClick={() => setIsProfileOpen(true)}
			>
				<AccountCircleIcon style={{ marginRight: '8px' }} />
				{userName ? userName : 'Профиль'}
			</button>

			{isProfileOpen && (
				<UserInfoModal
					onClose={() => setIsProfileOpen(false)}
					onLogout={handleLogout}
				/>
			)}
		</header>
	)
}
