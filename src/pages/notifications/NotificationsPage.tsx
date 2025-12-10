import NotificationsIcon from '@mui/icons-material/Notifications'
import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Tab,
	Tabs,
	Typography
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './NotificationsPage.module.css'
import {
	useInfiniteNotifications,
	useMarkAllAsRead
} from '@/entities/notification'
import type {
	INotification,
	INotificationFilters
} from '@/entities/notification'
import { NotificationCard, NotificationGroup } from '@/widgets/notifications'
import { groupNotificationsByDate } from '@/widgets/notifications/utils/groupNotificationsByDate'

type FilterTab = 'all' | 'unread' | 'read'
type TypeFilter = 'all' | 'permission_request'

export const NotificationsPage = () => {
	const { t } = useTranslation('notifications')
	const [activeTab, setActiveTab] = useState<FilterTab>('all')
	const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
	const limit = 20
	const loadMoreRef = useRef<HTMLDivElement>(null)

	const filters: INotificationFilters = useMemo(() => {
		const baseFilters: INotificationFilters = {
			limit
		}

		if (activeTab === 'unread') {
			baseFilters.read = false
		} else if (activeTab === 'read') {
			baseFilters.read = true
		}

		if (typeFilter !== 'all') {
			baseFilters.type = typeFilter
		}

		return baseFilters
	}, [activeTab, typeFilter, limit])

	const {
		data,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useInfiniteNotifications(filters)
	const markAllAsRead = useMarkAllAsRead()

	const notifications = useMemo(() => {
		return (
			data?.pages.flatMap((page: { items: INotification[] }) => page.items) ??
			[]
		)
	}, [data?.pages])

	const hasUnread = notifications.some(n => !n.read)

	const groupedNotifications = useMemo(
		() => groupNotificationsByDate(notifications, t),
		[notifications, t]
	)

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage()
				}
			},
			{
				threshold: 0.1,
				rootMargin: '100px'
			}
		)

		const currentRef = loadMoreRef.current
		if (currentRef) {
			observer.observe(currentRef)
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef)
			}
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	const handleTabChange = (
		_event: React.SyntheticEvent,
		newValue: FilterTab
	) => {
		setActiveTab(newValue)
	}

	const handleTypeFilterChange = (event: SelectChangeEvent<TypeFilter>) => {
		setTypeFilter(event.target.value as TypeFilter)
	}

	const handleMarkAllAsRead = () => {
		markAllAsRead.mutate()
	}

	return (
		<div className={styles.container}>
			<div className={styles.contentWrapper}>
				<div className={styles.header}>
					<div className={styles.titleSection}>
						<NotificationsIcon className={styles.headerIcon} />
						<Typography
							variant='h4'
							component='h1'
							className={styles.title}
						>
							{t('labels.notifications')}
						</Typography>
					</div>

					{hasUnread && (
						<Button
							variant='outlined'
							onClick={handleMarkAllAsRead}
							disabled={markAllAsRead.isPending}
							className={styles.markAllButton}
						>
							{t('labels.markAllAsRead')}
						</Button>
					)}
				</div>

				<Box className={styles.filtersContainer}>
					<Tabs
						value={activeTab}
						onChange={handleTabChange}
						className={styles.filterTabs}
					>
						<Tab
							label={t('labels.all')}
							value='all'
						/>
						<Tab
							label={t('labels.unread')}
							value='unread'
						/>
						<Tab
							label={t('labels.read')}
							value='read'
						/>
					</Tabs>

					<FormControl
						size='small'
						className={styles.typeFilter}
					>
						<InputLabel>{t('labels.filterByType')}</InputLabel>
						<Select
							value={typeFilter}
							label={t('labels.filterByType')}
							onChange={handleTypeFilterChange}
						>
							<MenuItem value='all'>{t('labels.all')}</MenuItem>
							<MenuItem value='permission_request'>
								{t('labels.typePermissionRequest')}
							</MenuItem>
						</Select>
					</FormControl>
				</Box>

				<Box className={styles.content}>
					{isLoading && notifications.length === 0 ? (
						<div className={styles.loading}>
							<CircularProgress />
						</div>
					) : error ? (
						<div className={styles.emptyState}>
							<Typography
								variant='h6'
								className={styles.emptyTitle}
								color='error'
							>
								{t('messages.errorLoading', { ns: 'common' })}
							</Typography>
						</div>
					) : notifications.length === 0 ? (
						<div className={styles.emptyState}>
							<NotificationsIcon className={styles.emptyIcon} />
							<Typography
								variant='h6'
								className={styles.emptyTitle}
							>
								{t('labels.noNotifications')}
							</Typography>
						</div>
					) : (
						<>
							<div className={styles.notificationsList}>
								{groupedNotifications.length > 0
									? groupedNotifications.map((group, index) => (
											<NotificationGroup
												key={group.key}
												group={group}
												groupIndex={index}
											/>
										))
									: notifications.map(notification => (
											<NotificationCard
												key={notification.id}
												notification={notification}
											/>
										))}
							</div>

							<div
								ref={loadMoreRef}
								className={styles.loadMoreTrigger}
							/>

							{isFetchingNextPage && (
								<div className={styles.loadingMore}>
									<CircularProgress size={24} />
								</div>
							)}
						</>
					)}
				</Box>
			</div>
		</div>
	)
}
