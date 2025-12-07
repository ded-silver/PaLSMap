import type { INotification } from '@/entities/notification'

export type NotificationGroup = {
	title: string
	key: string
	notifications: INotification[]
}

export const groupNotificationsByDate = (
	notifications: INotification[],
	t: (key: string, options?: { ns?: string }) => string
): NotificationGroup[] => {
	const now = new Date()
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	const yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)
	const weekAgo = new Date(today)
	weekAgo.setDate(weekAgo.getDate() - 7)

	const groups: { [key: string]: INotification[] } = {
		today: [],
		yesterday: [],
		thisWeek: [],
		earlier: []
	}

	notifications.forEach(notification => {
		const notificationDate = new Date(notification.createdAt)
		const notificationDay = new Date(
			notificationDate.getFullYear(),
			notificationDate.getMonth(),
			notificationDate.getDate()
		)

		if (notificationDay.getTime() === today.getTime()) {
			groups.today.push(notification)
		} else if (notificationDay.getTime() === yesterday.getTime()) {
			groups.yesterday.push(notification)
		} else if (notificationDate.getTime() >= weekAgo.getTime()) {
			groups.thisWeek.push(notification)
		} else {
			groups.earlier.push(notification)
		}
	})

	const result: NotificationGroup[] = []

	if (groups.today.length > 0) {
		result.push({
			title: t('labels.today', { ns: 'notifications' }),
			key: 'today',
			notifications: groups.today
		})
	}

	if (groups.yesterday.length > 0) {
		result.push({
			title: t('labels.yesterday', { ns: 'notifications' }),
			key: 'yesterday',
			notifications: groups.yesterday
		})
	}

	if (groups.thisWeek.length > 0) {
		result.push({
			title: t('labels.thisWeek', { ns: 'notifications' }),
			key: 'thisWeek',
			notifications: groups.thisWeek
		})
	}

	if (groups.earlier.length > 0) {
		result.push({
			title: t('labels.earlier', { ns: 'notifications' }),
			key: 'earlier',
			notifications: groups.earlier
		})
	}

	return result
}
