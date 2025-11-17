import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { IconButton, Typography } from '@mui/material'
import { ReactNode } from 'react'

import styles from './InfoRow.module.css'

interface InfoRowProps {
	label: string
	value: string | ReactNode
	icon?: ReactNode
	onCopy?: () => void
}

export const InfoRow = ({ label, value, icon, onCopy }: InfoRowProps) => {
	return (
		<div className={styles.container}>
			<div className={styles.label}>
				{icon}
				<Typography variant='body2'>{label}</Typography>
			</div>
			<div className={styles.value}>
				{typeof value === 'string' ? (
					<Typography variant='body1'>{value || '—'}</Typography>
				) : (
					value
				)}
			</div>
			{onCopy && (
				<IconButton
					size='small'
					onClick={onCopy}
					aria-label='Копировать'
				>
					<ContentCopyIcon fontSize='small' />
				</IconButton>
			)}
		</div>
	)
}

