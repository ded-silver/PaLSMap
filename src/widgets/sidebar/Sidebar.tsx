import BookIcon from '@mui/icons-material/Book'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import styles from './Sidebar.module.css'
import { useIsAdmin } from '@/entities/user'

interface Props {
	isOpen: boolean
	onClose?: () => void
}

export const Sidebar = ({ isOpen, onClose }: Props) => {
	const { t } = useTranslation('common')
	const isAdmin = useIsAdmin()

	const handleLinkClick = () => {
		if (onClose) {
			onClose()
		}
	}

	return (
		<div className={clsx(styles.sidebar, { [styles.open]: isOpen })}>
			<ul className={styles.menu}>
				<NavLink
					to='/'
					className={({ isActive }: { isActive: boolean }) =>
						clsx(styles.link, { [styles.active]: isActive })
					}
					onClick={handleLinkClick}
				>
					<li>
						<HomeIcon fontSize='small' />
						<span>{t('sidebar.home')}</span>
					</li>
				</NavLink>
				<NavLink
					to='/dictionary'
					className={({ isActive }: { isActive: boolean }) =>
						clsx(styles.link, { [styles.active]: isActive })
					}
					onClick={handleLinkClick}
				>
					<li>
						<BookIcon fontSize='small' />
						<span>{t('sidebar.dictionary')}</span>
					</li>
				</NavLink>
				{isAdmin && (
					<NavLink
						to='/admin/users'
						className={({ isActive }: { isActive: boolean }) =>
							clsx(styles.link, { [styles.active]: isActive })
						}
						onClick={handleLinkClick}
					>
						<li>
							<PeopleIcon fontSize='small' />
							<span>{t('sidebar.users')}</span>
						</li>
					</NavLink>
				)}
			</ul>
		</div>
	)
}
