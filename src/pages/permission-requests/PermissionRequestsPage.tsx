import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PersonIcon from '@mui/icons-material/Person'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SecurityIcon from '@mui/icons-material/Security'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
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
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import styles from './PermissionRequestsPage.module.css'
import type {
	IPermissionRequest,
	IPermissionRequestFilters
} from '@/entities/permission-request'
import { usePermissionRequests } from '@/entities/permission-request'
import { useIsAdmin, useUserProfile } from '@/entities/user'
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime'
import {
	ApproveRequestModal,
	CreatePermissionRequestModal,
	RejectRequestModal
} from '@/widgets/permission-request-modal'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

export const PermissionRequestsPage = () => {
	const { t } = useTranslation('notifications')
	const isAdmin = useIsAdmin()
	const { data: profile } = useUserProfile()
	const [searchParams, setSearchParams] = useSearchParams()
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

	const initialStatusFilter =
		(searchParams.get('status') as StatusFilter) || 'all'
	const [statusFilter, setStatusFilter] =
		useState<StatusFilter>(initialStatusFilter)
	const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'superAdmin'>(
		'all'
	)
	const [selectedRequestForApprove, setSelectedRequestForApprove] =
		useState<IPermissionRequest | null>(null)
	const [selectedRequestForReject, setSelectedRequestForReject] =
		useState<IPermissionRequest | null>(null)

	useEffect(() => {
		if (isAdmin) {
			if (statusFilter === 'all') {
				searchParams.delete('status')
			} else {
				searchParams.set('status', statusFilter)
			}
			setSearchParams(searchParams, { replace: true })
		}
	}, [statusFilter, isAdmin, searchParams, setSearchParams])

	const filters: IPermissionRequestFilters = useMemo(() => {
		const baseFilters: IPermissionRequestFilters = {}

		if (statusFilter !== 'all') {
			baseFilters.status = statusFilter
		}

		if (roleFilter !== 'all') {
			baseFilters.requestedRole = roleFilter
		}

		return baseFilters
	}, [statusFilter, roleFilter])

	const { data, isLoading, error } = usePermissionRequests(filters, {
		enablePolling: isAdmin
	})
	const requests = data?.items ?? []

	const getStatusColor = (status: IPermissionRequest['status']) => {
		switch (status) {
			case 'approved':
				return 'success'
			case 'rejected':
				return 'error'
			default:
				return 'warning'
		}
	}

	const getStatusLabel = (status: IPermissionRequest['status']) => {
		switch (status) {
			case 'pending':
				return t('labels.pending')
			case 'approved':
				return t('labels.approved')
			case 'rejected':
				return t('labels.rejected')
		}
	}

	const getRoleLabel = (role: IPermissionRequest['requestedRole']) => {
		return t(`profile.role.${role}`, { ns: 'common' })
	}

	const handleStatusFilterChange = (
		_event: React.SyntheticEvent,
		newValue: StatusFilter
	) => {
		setStatusFilter(newValue)
	}

	const handleRoleFilterChange = (event: SelectChangeEvent) => {
		setRoleFilter(event.target.value as 'all' | 'admin' | 'superAdmin')
	}

	const handleApproveClick = (request: IPermissionRequest) => {
		setSelectedRequestForApprove(request)
	}

	const handleRejectClick = (request: IPermissionRequest) => {
		setSelectedRequestForReject(request)
	}

	const pageTitle = isAdmin
		? t('labels.permissionRequests')
		: t('labels.myRequests')

	return (
		<div className={styles.container}>
			<div className={styles.contentWrapper}>
				<div className={styles.header}>
					<div className={styles.titleSection}>
						<SecurityIcon className={styles.headerIcon} />
						<Typography
							variant='h4'
							component='h1'
							className={styles.title}
						>
							{pageTitle}
						</Typography>
					</div>

					{!isAdmin && (
						<Button
							variant='contained'
							color='primary'
							startIcon={<SecurityIcon />}
							onClick={() => setIsCreateModalOpen(true)}
							className={styles.createRequestButton}
						>
							{t('labels.createRequest')}
						</Button>
					)}
				</div>

				{isAdmin && (
					<Box className={styles.filtersContainer}>
						<Tabs
							value={statusFilter}
							onChange={handleStatusFilterChange}
							className={styles.statusTabs}
						>
							<Tab
								label={t('labels.all')}
								value='all'
							/>
							<Tab
								label={t('labels.pending')}
								value='pending'
							/>
							<Tab
								label={t('labels.approved')}
								value='approved'
							/>
							<Tab
								label={t('labels.rejected')}
								value='rejected'
							/>
						</Tabs>

						<FormControl
							size='small'
							className={styles.roleFilter}
						>
							<InputLabel>{t('labels.requestedRole')}</InputLabel>
							<Select
								value={roleFilter}
								label={t('labels.requestedRole')}
								onChange={handleRoleFilterChange}
							>
								<MenuItem value='all'>{t('labels.all')}</MenuItem>
								<MenuItem value='admin'>
									{t('profile.role.admin', { ns: 'common' })}
								</MenuItem>
								<MenuItem value='superAdmin'>
									{t('profile.role.superAdmin', { ns: 'common' })}
								</MenuItem>
							</Select>
						</FormControl>
					</Box>
				)}

				<Box className={styles.content}>
					{isLoading ? (
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
								{t('messages.loadError')}
							</Typography>
						</div>
					) : requests.length === 0 ? (
						<div className={styles.emptyState}>
							<Typography
								variant='body1'
								className={styles.emptyText}
								color='text.secondary'
							>
								{t('labels.noRequests')}
							</Typography>
						</div>
					) : (
						<div className={styles.requestsList}>
							{requests.map(request => (
								<Card
									key={request.id}
									className={styles.requestCard}
								>
									<CardContent>
										{isAdmin && (
											<Box className={styles.userInfo}>
												<Box className={styles.userAvatar}>
													{request.user.name
														? request.user.name
																.split(' ')
																.map(n => n[0])
																.join('')
																.toUpperCase()
																.slice(0, 2)
														: request.user.email[0].toUpperCase()}
												</Box>
												<Box className={styles.userDetails}>
													<Typography
														variant='subtitle2'
														className={styles.userName}
													>
														{request.user.name || request.user.email}
													</Typography>
													<Typography
														variant='caption'
														className={styles.userEmail}
													>
														{request.user.email}
													</Typography>
												</Box>
											</Box>
										)}

										<Box className={styles.cardHeader}>
											<Box className={styles.cardTitle}>
												<Typography
													variant='h6'
													className={styles.requestTitle}
												>
													{getRoleLabel(request.requestedRole)}
												</Typography>
												<Chip
													label={getStatusLabel(request.status)}
													color={getStatusColor(request.status)}
													size='small'
												/>
											</Box>
										</Box>

										{request.reason && (
											<Typography
												variant='body2'
												className={styles.reason}
												color='text.secondary'
											>
												<strong>{t('labels.reason')}:</strong> {request.reason}
											</Typography>
										)}

										<Box className={styles.cardMeta}>
											<Box className={styles.cardMetaItem}>
												<ScheduleIcon />
												<Typography
													variant='caption'
													color='text.secondary'
												>
													{t('labels.createdAt')}:{' '}
													{formatRelativeTime(
														request.createdAt,
														t,
														'notifications'
													)}
												</Typography>
											</Box>

											{request.reviewedAt && request.reviewedBy && (
												<>
													<Box className={styles.cardMetaItem}>
														<ScheduleIcon />
														<Typography
															variant='caption'
															color='text.secondary'
														>
															{t('labels.reviewedAt')}:{' '}
															{formatRelativeTime(
																request.reviewedAt,
																t,
																'notifications'
															)}
														</Typography>
													</Box>
													<Box className={styles.cardMetaItem}>
														<VerifiedUserIcon />
														<Typography
															variant='caption'
															color='text.secondary'
														>
															{t('labels.reviewedBy')}:{' '}
															{request.reviewedBy.name ||
																request.reviewedBy.email}
														</Typography>
													</Box>
												</>
											)}
										</Box>

										{isAdmin && request.status === 'pending' && (
											<Box className={styles.cardActions}>
												<Button
													variant='contained'
													color='success'
													size='small'
													startIcon={<CheckCircleIcon />}
													onClick={() => handleApproveClick(request)}
													className={styles.approveButton}
												>
													{t('labels.approve')}
												</Button>
												<Button
													variant='contained'
													color='error'
													size='small'
													startIcon={<CancelIcon />}
													onClick={() => handleRejectClick(request)}
													className={styles.rejectButton}
												>
													{t('labels.reject')}
												</Button>
											</Box>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</Box>
			</div>

			{!isAdmin && (
				<CreatePermissionRequestModal
					open={isCreateModalOpen}
					onClose={() => setIsCreateModalOpen(false)}
				/>
			)}

			{selectedRequestForApprove && (
				<ApproveRequestModal
					open={!!selectedRequestForApprove}
					onClose={() => setSelectedRequestForApprove(null)}
					requestId={selectedRequestForApprove.id}
					userName={
						selectedRequestForApprove.user.name ||
						selectedRequestForApprove.user.email
					}
				/>
			)}

			{selectedRequestForReject && (
				<RejectRequestModal
					open={!!selectedRequestForReject}
					onClose={() => setSelectedRequestForReject(null)}
					requestId={selectedRequestForReject.id}
					userName={
						selectedRequestForReject.user.name ||
						selectedRequestForReject.user.email
					}
				/>
			)}
		</div>
	)
}
