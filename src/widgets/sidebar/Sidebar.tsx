import BookIcon from '@mui/icons-material/Book'
import HomeIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'
import StarIcon from '@mui/icons-material/Star'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import styles from './Sidebar.module.css'

interface Props {
	isOpen: boolean
	onClose?: () => void
}

export const Sidebar = ({ isOpen, onClose }: Props) => {
	const { t } = useTranslation('common')

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
			</ul>
		</div>
	)
}
