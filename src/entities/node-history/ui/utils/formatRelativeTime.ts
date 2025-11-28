export const formatRelativeTime = (
	dateString: string,
	t: (key: string, options?: any) => string
): string => {
	const date = new Date(dateString)
	const now = new Date()
	const diffMs = now.getTime() - date.getTime()
	const diffSeconds = Math.floor(diffMs / 1000)
	const diffMinutes = Math.floor(diffSeconds / 60)
	const diffHours = Math.floor(diffMinutes / 60)
	const diffDays = Math.floor(diffHours / 24)
	const diffWeeks = Math.floor(diffDays / 7)
	const diffMonths = Math.floor(diffDays / 30)
	const diffYears = Math.floor(diffDays / 365)

	if (diffSeconds < 60) {
		return t('time.justNow', { ns: 'node-history' })
	}

	if (diffMinutes < 60) {
		return t('time.minutesAgo', { ns: 'node-history', count: diffMinutes })
	}

	if (diffHours < 24) {
		return t('time.hoursAgo', { ns: 'node-history', count: diffHours })
	}

	if (diffDays < 7) {
		return t('time.daysAgo', { ns: 'node-history', count: diffDays })
	}

	if (diffWeeks < 4) {
		return t('time.weeksAgo', { ns: 'node-history', count: diffWeeks })
	}

	if (diffMonths < 12) {
		return t('time.monthsAgo', { ns: 'node-history', count: diffMonths })
	}

	return t('time.yearsAgo', { ns: 'node-history', count: diffYears })
}
