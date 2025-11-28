import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import type { HistoryChanges } from '../../model/types'

import styles from './ChangesDiff.module.css'

interface ChangesDiffProps {
	changes: HistoryChanges
}

export const ChangesDiff = ({ changes }: ChangesDiffProps) => {
	const { t } = useTranslation('node-history')

	const before = changes.before || {}
	const after = changes.after || {}

	const allKeys = new Set([...Object.keys(before), ...Object.keys(after)])

	if (allKeys.size === 0) {
		return (
			<Typography
				variant='body2'
				className={styles.noChanges}
			>
				{t('messages.noChanges', { ns: 'node-history' })}
			</Typography>
		)
	}

	return (
		<Box className={styles.container}>
			{Array.from(allKeys).map(key => {
				const beforeValue = before[key]
				const afterValue = after[key]
				const isDeleted = beforeValue !== undefined && afterValue === undefined
				const isAdded = beforeValue === undefined && afterValue !== undefined
				const isChanged =
					beforeValue !== undefined &&
					afterValue !== undefined &&
					JSON.stringify(beforeValue) !== JSON.stringify(afterValue)

				return (
					<Box
						key={key}
						className={styles.field}
					>
						<Typography
							variant='caption'
							className={styles.fieldName}
						>
							{key}:
						</Typography>
						<Box className={styles.values}>
							{beforeValue !== undefined && (
								<Box
									className={`${styles.value} ${styles.before} ${
										isDeleted || isChanged ? styles.changed : ''
									}`}
								>
									<Typography
										variant='caption'
										className={styles.label}
									>
										{t('labels.before', { ns: 'node-history' })}:
									</Typography>
									<pre className={styles.valueContent}>
										{JSON.stringify(beforeValue, null, 2)}
									</pre>
								</Box>
							)}
							{afterValue !== undefined && (
								<Box
									className={`${styles.value} ${styles.after} ${
										isAdded || isChanged ? styles.changed : ''
									}`}
								>
									<Typography
										variant='caption'
										className={styles.label}
									>
										{t('labels.after', { ns: 'node-history' })}:
									</Typography>
									<pre className={styles.valueContent}>
										{JSON.stringify(afterValue, null, 2)}
									</pre>
								</Box>
							)}
						</Box>
					</Box>
				)
			})}
		</Box>
	)
}
