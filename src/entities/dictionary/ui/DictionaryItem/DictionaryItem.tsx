import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton } from '@mui/material'
import { useTranslation } from 'react-i18next'

import type { IDictionary } from '../../model/types'

import styles from './DictionaryItem.module.css'

interface DictionaryItemProps {
	item: IDictionary
	isAdmin: boolean
	onEdit: (item: IDictionary) => void
	onDelete: (id: string) => void
}

export const DictionaryItem = ({
	item,
	isAdmin,
	onEdit,
	onDelete
}: DictionaryItemProps) => {
	const { t } = useTranslation('common')

	return (
		<div className={`${styles.item} ${isAdmin ? styles.hasActions : ''}`}>
			<div className={styles.short}>{item.short}</div>
			<div className={styles.full}>{item.full}</div>
			{isAdmin && (
				<div className={styles.actions}>
					<IconButton
						size='small'
						onClick={() => onEdit(item)}
						aria-label={t('buttons.edit')}
						className={styles.editButton}
					>
						<EditIcon fontSize='small' />
					</IconButton>
					<IconButton
						size='small'
						onClick={() => onDelete(item.id)}
						aria-label={t('buttons.delete')}
						className={styles.deleteButton}
					>
						<DeleteIcon fontSize='small' />
					</IconButton>
				</div>
			)}
		</div>
	)
}
