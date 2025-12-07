import { Box, Typography } from '@mui/material'
import { memo } from 'react'

import { NotificationCard } from './NotificationCard'
import styles from './NotificationGroup.module.css'
import type { NotificationGroup as INotificationGroup } from './utils/groupNotificationsByDate'

interface NotificationGroupProps {
	group: INotificationGroup
	groupIndex: number
}

export const NotificationGroup = memo(
	({ group, groupIndex }: NotificationGroupProps) => {
		return (
			<Box
				className={styles.group}
				style={{ '--group-index': groupIndex } as React.CSSProperties}
			>
				<Typography
					variant='subtitle1'
					className={styles.groupTitle}
				>
					{group.title}
				</Typography>
				<Box className={styles.notifications}>
					{group.notifications.map((notification, index) => (
						<NotificationCard
							key={notification.id}
							notification={notification}
							animationDelay={index * 0.05}
						/>
					))}
				</Box>
			</Box>
		)
	}
)

NotificationGroup.displayName = 'NotificationGroup'
