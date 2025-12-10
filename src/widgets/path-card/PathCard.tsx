import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FolderIcon from '@mui/icons-material/Folder'
import MapIcon from '@mui/icons-material/Map'
import { IconButton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import styles from './PathCard.module.css'
import type { Country } from '@/entities/country'
import type { PathArea } from '@/entities/path-area'
import { useIsAdmin } from '@/entities/user'

interface PathCardProps {
	type: 'country' | 'area'
	item: Country | PathArea
	onEdit?: (item: Country | PathArea) => void
	onDelete?: (id: string, countryId?: string) => void
}

export const PathCard = ({ type, item, onEdit, onDelete }: PathCardProps) => {
	const { t } = useTranslation('path-areas')
	const navigate = useNavigate()
	const isAdmin = useIsAdmin()

	const handleClick = () => {
		if (type === 'country') {
			navigate(`/map/${item.id}`)
		} else {
			const area = item as PathArea
			navigate(`/map/${area.countryId}/${area.id}`)
		}
	}

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation()
		onEdit?.(item)
	}

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (type === 'country') {
			onDelete?.(item.id)
		} else {
			const area = item as PathArea
			onDelete?.(item.id, area.countryId)
		}
	}

	return (
		<div
			className={styles.card}
			onClick={handleClick}
		>
			<div className={styles.iconWrapper}>
				<div className={`${styles.iconCircle} ${styles[type]}`}>
					{type === 'country' ? (
						<FolderIcon className={styles.icon} />
					) : (
						<MapIcon className={styles.icon} />
					)}
				</div>
			</div>
			<div className={styles.content}>
				<div className={styles.name}>{item.name}</div>
				{type === 'country' && 'code' in item && item.code && (
					<div className={styles.code}>{item.code}</div>
				)}
			</div>
			{isAdmin && (onEdit || onDelete) && (
				<div
					className={styles.actions}
					onClick={e => e.stopPropagation()}
				>
					{onEdit && (
						<IconButton
							size='small'
							onClick={handleEdit}
							aria-label={t('buttons.edit', { ns: 'common' })}
							className={styles.actionButton}
						>
							<EditIcon fontSize='small' />
						</IconButton>
					)}
					{onDelete && (
						<IconButton
							size='small'
							onClick={handleDelete}
							aria-label={t('buttons.delete', { ns: 'common' })}
							className={`${styles.actionButton} ${styles.deleteButton}`}
						>
							<DeleteIcon fontSize='small' />
						</IconButton>
					)}
				</div>
			)}
		</div>
	)
}
