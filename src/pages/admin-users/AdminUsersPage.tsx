import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PeopleIcon from '@mui/icons-material/People'
import PersonIcon from '@mui/icons-material/Person'
import SaveIcon from '@mui/icons-material/Save'
import ShieldIcon from '@mui/icons-material/Shield'
import {
	Avatar,
	Button,
	Chip,
	CircularProgress,
	Paper,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography
} from '@mui/material'
import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './AdminUsersPage.module.css'
import { useAllUsers, useIsAdmin, useUpdateUserByAdmin } from '@/entities/user'
import type { IUpdateUserByAdminDto, IUserForAdmin } from '@/entities/user'
import { normalizeAvatarUrl } from '@/shared/lib'
import { MUI_STYLES } from '@/shared/styles/mui-styles'
import { SearchBar } from '@/shared/ui'

export const AdminUsersPage = () => {
	const { t } = useTranslation(['common', 'admin'])
	const isAdmin = useIsAdmin()
	const { data: users, isLoading, error } = useAllUsers()
	const { mutate: updateUser, isPending } = useUpdateUserByAdmin()

	const [searchTerm, setSearchTerm] = useState('')
	const [editedUsers, setEditedUsers] = useState<
		Record<string, IUpdateUserByAdminDto>
	>({})

	const filteredUsers = useMemo(() => {
		if (!users || !searchTerm.trim()) {
			return users || []
		}

		const searchLower = searchTerm.toLowerCase()
		return users.filter(
			user =>
				(user.name || '').toLowerCase().includes(searchLower) ||
				user.email.toLowerCase().includes(searchLower)
		)
	}, [users, searchTerm])

	const stats = useMemo(() => {
		if (!users) return { total: 0, admins: 0, users: 0, superAdmins: 0 }
		return {
			total: users.length,
			admins: users.filter(u => u.isAdmin && !u.isSuperAdmin).length,
			users: users.filter(u => !u.isAdmin).length,
			superAdmins: users.filter(u => u.isSuperAdmin).length
		}
	}, [users])

	const handlePositionChange = (userId: string, position: string) => {
		setEditedUsers(prev => ({
			...prev,
			[userId]: {
				...prev[userId],
				position: position || undefined
			}
		}))
	}

	const handleAdminToggle = (userId: string, isAdmin: boolean) => {
		setEditedUsers(prev => ({
			...prev,
			[userId]: {
				...prev[userId],
				isAdmin
			}
		}))
	}

	const handleSave = (user: IUserForAdmin) => {
		const changes = editedUsers[user.id]
		if (!changes || Object.keys(changes).length === 0) {
			return
		}

		updateUser(
			{ id: user.id, dto: changes },
			{
				onSuccess: () => {
					setEditedUsers(prev => {
						const newState = { ...prev }
						delete newState[user.id]
						return newState
					})
				}
			}
		)
	}

	const formatDate = useCallback((dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}, [])

	const hasChanges = useMemo(() => {
		const changesMap = new Set<string>()
		Object.keys(editedUsers).forEach(userId => {
			const changes = editedUsers[userId]
			if (changes && Object.keys(changes).length > 0) {
				changesMap.add(userId)
			}
		})
		return (userId: string) => changesMap.has(userId)
	}, [editedUsers])

	if (!isAdmin) {
		return (
			<div className={styles.container}>
				<div className={styles.contentWrapper}>
					<div className={styles.header}>
						<div className={styles.titleSection}>
							<PeopleIcon className={styles.headerIcon} />
							<Typography
								variant='h4'
								component='h1'
								className={styles.title}
							>
								{t('title', { ns: 'admin' })}
							</Typography>
						</div>
					</div>
					<div className={styles.errorState}>
						<Typography variant='h6'>
							{t('accessDenied', { ns: 'admin' })}
						</Typography>
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.container}>
				<div className={styles.contentWrapper}>
					<div className={styles.header}>
						<div className={styles.titleSection}>
							<PeopleIcon className={styles.headerIcon} />
							<Typography
								variant='h4'
								component='h1'
								className={styles.title}
							>
								{t('title', { ns: 'admin' })}
							</Typography>
						</div>
					</div>
					<div className={styles.errorState}>
						<Typography variant='h6'>
							{t('errors.loadError', { ns: 'common' })}
						</Typography>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<div className={styles.contentWrapper}>
				<div className={styles.header}>
					<div className={styles.titleSection}>
						<PeopleIcon className={styles.headerIcon} />
						<Typography
							variant='h4'
							component='h1'
							className={styles.title}
						>
							{t('title', { ns: 'admin' })}
						</Typography>
					</div>

					<div className={styles.searchSection}>
						<div className={styles.searchBarWrapper}>
							<SearchBar
								placeholder={t('search', { ns: 'admin' })}
								onChange={e => setSearchTerm(e.target.value)}
							/>
						</div>
						{searchTerm && (
							<Typography
								variant='body2'
								className={styles.searchResults}
							>
								{t('searchResults', {
									ns: 'admin',
									count: filteredUsers.length
								})}
							</Typography>
						)}
					</div>
				</div>

				<div className={styles.statsContainer}>
					<Paper className={styles.statCard}>
						<div className={styles.statIcon}>
							<PersonIcon />
						</div>
						<div className={styles.statContent}>
							<Typography
								variant='h6'
								className={styles.statValue}
							>
								{stats.total}
							</Typography>
							<Typography
								variant='body2'
								className={styles.statLabel}
							>
								{t('stats.total', { ns: 'admin' })}
							</Typography>
						</div>
					</Paper>
					<Paper className={styles.statCard}>
						<div className={styles.statIcon}>
							<AdminPanelSettingsIcon />
						</div>
						<div className={styles.statContent}>
							<Typography
								variant='h6'
								className={styles.statValue}
							>
								{stats.admins}
							</Typography>
							<Typography
								variant='body2'
								className={styles.statLabel}
							>
								{t('stats.admins', { ns: 'admin' })}
							</Typography>
						</div>
					</Paper>
					<Paper className={styles.statCard}>
						<div className={styles.statIcon}>
							<AccountCircleIcon />
						</div>
						<div className={styles.statContent}>
							<Typography
								variant='h6'
								className={styles.statValue}
							>
								{stats.users}
							</Typography>
							<Typography
								variant='body2'
								className={styles.statLabel}
							>
								{t('stats.users', { ns: 'admin' })}
							</Typography>
						</div>
					</Paper>
					<Paper className={styles.statCard}>
						<div className={styles.statIcon}>
							<ShieldIcon />
						</div>
						<div className={styles.statContent}>
							<Typography
								variant='h6'
								className={styles.statValue}
							>
								{stats.superAdmins}
							</Typography>
							<Typography
								variant='body2'
								className={styles.statLabel}
							>
								{t('stats.superAdmins', { ns: 'admin' })}
							</Typography>
						</div>
					</Paper>
				</div>

				{isLoading ? (
					<div className={styles.loading}>
						<CircularProgress />
					</div>
				) : filteredUsers.length > 0 ? (
					<TableContainer
						component={Paper}
						className={styles.tableContainer}
					>
						<Table>
							<TableHead>
								<TableRow className={styles.tableHeaderRow}>
									<TableCell className={styles.tableHeaderCell}>
										{t('name', { ns: 'admin' })}
									</TableCell>
									<TableCell className={styles.tableHeaderCell}>
										{t('email', { ns: 'admin' })}
									</TableCell>
									<TableCell className={styles.tableHeaderCell}>
										{t('position', { ns: 'admin' })}
									</TableCell>
									<TableCell className={styles.tableHeaderCell}>
										{t('role', { ns: 'admin' })}
									</TableCell>
									<TableCell className={styles.tableHeaderCell}>
										{t('createdAt', { ns: 'admin' })}
									</TableCell>
									<TableCell
										align='right'
										className={styles.tableHeaderCell}
									>
										{t('buttons.save', { ns: 'common' })}
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredUsers.map(user => {
									const userHasChanges = hasChanges(user.id)
									const editedPosition =
										editedUsers[user.id]?.position !== undefined
											? editedUsers[user.id].position || ''
											: user.position || ''
									const editedIsAdmin =
										editedUsers[user.id]?.isAdmin !== undefined
											? editedUsers[user.id].isAdmin
											: user.isAdmin

									return (
										<TableRow key={user.id}>
											<TableCell>
												<div className={styles.userCell}>
													<Avatar
														src={normalizeAvatarUrl(
															user.avatar,
															user.updatedAt
														)}
														className={styles.avatar}
													>
														{!user.avatar && <AccountCircleIcon />}
													</Avatar>
													<div className={styles.userInfo}>
														<Typography
															variant='body2'
															className={styles.userName}
														>
															{user.name || user.email}
														</Typography>
														{user.isSuperAdmin && (
															<Chip
																icon={<ShieldIcon />}
																label={t('superAdmin', { ns: 'admin' })}
																size='small'
																color='error'
																className={styles.superAdminChip}
															/>
														)}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Typography
													variant='body2'
													className={styles.email}
												>
													{user.email}
												</Typography>
											</TableCell>
											<TableCell>
												<TextField
													size='small'
													value={editedPosition}
													onChange={e =>
														handlePositionChange(user.id, e.target.value)
													}
													placeholder={t('placeholders.position', {
														ns: 'common'
													})}
													disabled={user.isSuperAdmin || isPending}
													className={styles.positionInput}
													autoComplete='off'
													inputProps={{
														autoComplete: 'off'
													}}
												/>
											</TableCell>
											<TableCell>
												<div className={styles.roleCell}>
													<Switch
														checked={editedIsAdmin}
														onChange={e =>
															handleAdminToggle(user.id, e.target.checked)
														}
														disabled={user.isSuperAdmin || isPending}
														color='primary'
													/>
													<Chip
														label={
															editedIsAdmin
																? t('admin', { ns: 'admin' })
																: t('user', { ns: 'admin' })
														}
														size='small'
														color={editedIsAdmin ? 'primary' : 'default'}
														variant='outlined'
													/>
												</div>
											</TableCell>
											<TableCell>{formatDate(user.createdAt)}</TableCell>
											<TableCell align='right'>
												<Button
													variant='contained'
													size='small'
													startIcon={<SaveIcon />}
													onClick={() => handleSave(user)}
													disabled={
														!userHasChanges || user.isSuperAdmin || isPending
													}
													className={styles.saveButton}
												>
													{t('buttons.save', { ns: 'common' })}
												</Button>
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					</TableContainer>
				) : (
					<div className={styles.noResults}>
						{t('messages.noResults', { ns: 'common' })}
					</div>
				)}
			</div>
		</div>
	)
}
