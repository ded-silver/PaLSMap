import NotificationsIcon from '@mui/icons-material/Notifications'
import {
	Box,
	Button,
	CircularProgress,
	Popover,
	Typography
} from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { NotificationCard } from './NotificationCard'
import styles from './NotificationsPopover.module.css'
import { useMarkAllAsRead, useNotifications } from '@/entities/notification'

interface NotificationsPopoverProps {
	anchorEl: HTMLElement | null
	open: boolean
	onClose: () => void
}

export const NotificationsPopover = ({
	anchorEl,
	open,
	onClose
}: NotificationsPopoverProps) => {
	const { t } = useTranslation('notifications')
	const navigate = useNavigate()
	const { data, isLoading, error } = useNotifications({ limit: 10 })
	const markAllAsRead = useMarkAllAsRead()

	const notifications = useMemo(() => data?.items ?? [], [data?.items])
	const hasUnread = useMemo(
		() => notifications.some(n => !n.read),
		[notifications]
	)

	const handleMarkAllAsRead = useCallback(() => {
		if (hasUnread) {
			markAllAsRead.mutate()
		}
	}, [hasUnread, markAllAsRead])

	const handleShowAll = useCallback(() => {
		onClose()
		navigate('/notifications')
	}, [onClose, navigate])

	return (
		<Popover
			open={open}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center'
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center'
			}}
			role='dialog'
			aria-labelledby='notifications-popover-title'
			aria-describedby='notifications-popover-description'
			PaperProps={{
				sx: {
					width: 'var(--notification-popover-width)',
					maxHeight: 'var(--notification-popover-max-height)',
					mt: 2.5,
					borderRadius: 'var(--border-radius-xl)',
					boxShadow: 'var(--effect-shadow-xl)',
					overflow: 'hidden',
					background: 'var(--color-background)'
				}
			}}
		>
			<Box className={styles.container}>
				<Box className={styles.header}>
					<Box className={styles.headerTitle}>
						<NotificationsIcon
							className={styles.headerIcon}
							aria-hidden='true'
						/>
						<Typography
							variant='h6'
							className={styles.headerText}
							id='notifications-popover-title'
						>
							{t('labels.notifications')}
						</Typography>
					</Box>
					{hasUnread && (
						<Button
							size='small'
							onClick={handleMarkAllAsRead}
							disabled={markAllAsRead.isPending}
							className={styles.markAllButton}
							aria-label={t('labels.markAllAsRead')}
						>
							{t('labels.markAllAsRead')}
						</Button>
					)}
				</Box>

				<Box
					className={styles.content}
					id='notifications-popover-description'
					role='region'
					aria-label={t('labels.notificationsList')}
				>
					{isLoading ? (
						<Box
							className={styles.loading}
							role='status'
							aria-live='polite'
							aria-label={t('messages.loading')}
						>
							<CircularProgress
								size={24}
								aria-hidden='true'
							/>
						</Box>
					) : error ? (
						<Box
							className={styles.empty}
							role='alert'
							aria-live='assertive'
						>
							<Typography
								variant='body2'
								color='error'
							>
								{t('messages.errorLoading', { ns: 'common' })}
							</Typography>
						</Box>
					) : notifications.length === 0 ? (
						<Box className={styles.empty}>
							<Typography
								variant='body2'
								color='text.secondary'
							>
								{t('labels.noNotifications')}
							</Typography>
						</Box>
					) : (
						<Box
							className={styles.notificationsList}
							role='list'
							aria-label={t('labels.notificationsList')}
						>
							{notifications.map(notification => (
								<NotificationCard
									key={notification.id}
									notification={notification}
								/>
							))}
						</Box>
					)}
				</Box>

				{notifications.length > 0 && (
					<Box className={styles.footer}>
						<Button
							fullWidth
							onClick={handleShowAll}
							className={styles.showAllButton}
							aria-label={t('labels.showAllNotifications')}
						>
							{t('labels.showAll')}
						</Button>
					</Box>
				)}
			</Box>
		</Popover>
	)
}
