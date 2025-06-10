import BookIcon from '@mui/icons-material/Book'
import HomeIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'
import StarIcon from '@mui/icons-material/Star'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

import styles from './Sidebar.module.css'

interface Props {
	isOpen: boolean
	// onClose: () => void
}

export const Sidebar = ({ isOpen }: Props) => {
	return (
		<div className={clsx(styles.sidebar, { [styles.open]: isOpen })}>
			<ul className={styles.menu}>
				<NavLink
					to='/'
					className={({ isActive }: { isActive: boolean }) =>
						clsx(styles.link, { [styles.active]: isActive })
					}
					// onClick={onclose}
				>
					<li>
						<HomeIcon fontSize='small' />
						<span>Главная</span>
					</li>
				</NavLink>
				<NavLink
					to='/dictionary'
					className={({ isActive }: { isActive: boolean }) =>
						clsx(styles.link, { [styles.active]: isActive })
					}
				>
					<li>
						<BookIcon fontSize='small' />
						<span>Словарь</span>
					</li>
				</NavLink>
				<NavLink
					to='/item3'
					className={({ isActive }: { isActive: boolean }) =>
						clsx(styles.link, { [styles.active]: isActive })
					}
					// Поменять когда придется
					onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
						e.preventDefault()
						alert('Тебе туда не надо')
					}}
				>
					<li>
						<StarIcon fontSize='small' />
						<span>Элемент 3</span>
					</li>
				</NavLink>
				<NavLink
					to='/item4'
					className={({ isActive }: { isActive: boolean }) =>
						clsx(styles.link, { [styles.active]: isActive })
					}
					// Поменять когда придется
					onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
						e.preventDefault()
						alert('Тебе туда не надо')
					}}
				>
					<li>
						<SettingsIcon fontSize='small' />
						<span>Элемент 4</span>
					</li>
				</NavLink>
			</ul>
		</div>
	)
}
