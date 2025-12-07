import NotificationsIcon from '@mui/icons-material/Notifications'
import { Badge, IconButton } from '@mui/material'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useUnreadCount } from '@/entities/notification'
import { BUTTON_STYLES } from '@/shared/styles/tokens'

interface NotificationsBellProps {
	onClick: () => void
}

export const NotificationsBell = forwardRef<
	HTMLButtonElement,
	NotificationsBellProps
>(({ onClick }, ref) => {
	const { t } = useTranslation('notifications')
	const { data: unreadCountData, isLoading } = useUnreadCount()
	const unreadCount = unreadCountData?.count ?? 0

	const ariaLabel =
		unreadCount > 0
			? t('labels.notificationsWithCount', { count: unreadCount })
			: t('labels.notifications')

	return (
		<IconButton
			ref={ref}
			onClick={onClick}
			aria-label={ariaLabel}
			aria-describedby='notifications-count'
			aria-live='polite'
			aria-atomic='true'
			sx={{
				width: BUTTON_STYLES.heights.md,
				height: BUTTON_STYLES.heights.md,
				background: BUTTON_STYLES.glass.dark.background,
				backdropFilter: BUTTON_STYLES.effects.blur,
				boxShadow: BUTTON_STYLES.effects.shadow,
				color: BUTTON_STYLES.glass.dark.text,
				position: 'relative',
				'&:hover': {
					background: BUTTON_STYLES.glass.dark.hover,
					color: BUTTON_STYLES.glass.dark.textHover
				},
				'& svg': {
					fontSize: '24px',
					opacity: 0.9
				}
			}}
		>
			<Badge
				badgeContent={isLoading ? 0 : unreadCount}
				color='error'
				max={99}
				sx={{
					'& .MuiBadge-badge': {
						animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none'
					}
				}}
			>
				<NotificationsIcon />
			</Badge>
			<span
				id='notifications-count'
				className='sr-only'
			>
				{unreadCount > 0
					? t('labels.unreadNotificationsCount', { count: unreadCount })
					: t('labels.noUnreadNotifications')}
			</span>
		</IconButton>
	)
})

NotificationsBell.displayName = 'NotificationsBell'
