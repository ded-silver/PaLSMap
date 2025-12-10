export const formatRelativeTime = (
	dateString: string,
	t: (key: string, options?: { count?: number; ns?: string }) => string
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
		return t('time.justNow', { ns: 'common' })
	}

	if (diffMinutes < 60) {
		return t('time.minutesAgo', { ns: 'common', count: diffMinutes })
	}

	if (diffHours < 24) {
		return t('time.hoursAgo', { ns: 'common', count: diffHours })
	}

	if (diffDays < 7) {
		return t('time.daysAgo', { ns: 'common', count: diffDays })
	}

	if (diffWeeks < 4) {
		return t('time.weeksAgo', { ns: 'common', count: diffWeeks })
	}

	if (diffMonths < 12) {
		return t('time.monthsAgo', { ns: 'common', count: diffMonths })
	}

	return t('time.yearsAgo', { ns: 'common', count: diffYears })
}
