import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ErrorIcon from '@mui/icons-material/Error'
import InfoIcon from '@mui/icons-material/Info'
import SecurityIcon from '@mui/icons-material/Security'
import WarningIcon from '@mui/icons-material/Warning'
import { Box, IconButton, Typography } from '@mui/material'
import { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import styles from './NotificationCard.module.css'
import type { INotification } from '@/entities/notification'
import { useDeleteNotification, useMarkAsRead } from '@/entities/notification'
import { useIsAdmin } from '@/entities/user'
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime'

interface NotificationCardProps {
	notification: INotification
	animationDelay?: number
}

const getNotificationIcon = (type: INotification['type']) => {
	switch (type) {
		case 'success':
			return <CheckCircleIcon className={styles.iconSuccess} />
		case 'warning':
			return <WarningIcon className={styles.iconWarning} />
		case 'error':
			return <ErrorIcon className={styles.iconError} />
		case 'permission_request':
			return <SecurityIcon className={styles.iconPermission} />
		default:
			return <InfoIcon className={styles.iconInfo} />
	}
}

export const NotificationCard = memo(
	({ notification, animationDelay = 0 }: NotificationCardProps) => {
		const { t } = useTranslation('notifications')
		const navigate = useNavigate()
		const isAdmin = useIsAdmin()
		const markAsRead = useMarkAsRead()
		const deleteNotification = useDeleteNotification()

		const handleClick = useCallback(() => {
			if (!notification.read) {
				markAsRead.mutate(notification.id)
			}

			if (
				notification.type === 'permission_request' &&
				notification.relatedEntityType === 'PERMISSION_REQUEST'
			) {
				if (isAdmin) {
					navigate('/permission-requests?status=pending')
				} else {
					navigate('/profile/permission-requests')
				}
			}
		}, [
			notification.read,
			notification.id,
			notification.type,
			notification.relatedEntityType,
			isAdmin,
			navigate,
			markAsRead
		])

		const handleDelete = useCallback(
			(e: React.MouseEvent) => {
				e.stopPropagation()
				deleteNotification.mutate(notification.id)
			},
			[notification.id, deleteNotification]
		)

		const relativeTime = useMemo(
			() => formatRelativeTime(notification.createdAt, t, 'notifications'),
			[notification.createdAt, t]
		)

		const message = useMemo(
			() =>
				notification.message.length > 100
					? `${notification.message.substring(0, 100)}...`
					: notification.message,
			[notification.message]
		)

		const isUnread = !notification.read

		return (
			<Box
				className={`${styles.card} ${isUnread ? styles.unread : ''}`}
				onClick={handleClick}
				role='button'
				tabIndex={0}
				aria-label={t('labels.notificationCard', {
					title: notification.title,
					read: notification.read
				})}
				aria-describedby={`notification-${notification.id}-description`}
				style={
					{
						animationDelay: `${animationDelay}s`
					} as React.CSSProperties
				}
				onKeyDown={e => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						handleClick()
					}
				}}
			>
				<Box className={styles.cardContent}>
					<Box
						className={styles.iconWrapper}
						aria-hidden='true'
					>
						{getNotificationIcon(notification.type)}
					</Box>
					<Box className={styles.textContent}>
						<Typography
							variant='subtitle2'
							className={styles.title}
							fontWeight={notification.read ? 'normal' : 'bold'}
							component='div'
						>
							{notification.title}
						</Typography>
						<Typography
							variant='body2'
							className={styles.message}
							color='text.secondary'
							id={`notification-${notification.id}-description`}
						>
							{message}
						</Typography>
						<Typography
							variant='caption'
							className={styles.time}
							color='text.secondary'
							aria-label={t('labels.createdAt') + ': ' + relativeTime}
						>
							{relativeTime}
						</Typography>
					</Box>
				</Box>
				{isUnread && (
					<Box
						className={styles.unreadIndicator}
						aria-label={t('labels.unread')}
					/>
				)}
				<IconButton
					size='small'
					onClick={handleDelete}
					className={styles.deleteButton}
					aria-label={t('labels.deleteNotification')}
					onKeyDown={e => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.stopPropagation()
							handleDelete(e as any)
						}
					}}
				>
					<DeleteOutlineIcon fontSize='small' />
				</IconButton>
			</Box>
		)
	}
)

NotificationCard.displayName = 'NotificationCard'
