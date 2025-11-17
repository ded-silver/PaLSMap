import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EditIcon from '@mui/icons-material/Edit'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import ShieldIcon from '@mui/icons-material/Shield'
import UpdateIcon from '@mui/icons-material/Update'
import WorkIcon from '@mui/icons-material/Work'
import { Avatar, Button, Chip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { InfoRow } from './InfoRow'
import styles from './ProfileView.module.css'
import type { IProfileResponse } from '@/entities/user'
import { normalizeAvatarUrl } from '@/shared/lib'

interface ProfileViewProps {
	profile: IProfileResponse
	onEditClick: () => void
	onChangePasswordClick: () => void
}

export const ProfileView = ({
	profile,
	onEditClick,
	onChangePasswordClick
}: ProfileViewProps) => {
	const { t } = useTranslation('common')

	const avatarUrl = normalizeAvatarUrl(profile.avatar, profile.updatedAt)

	const handleCopyEmail = () => {
		navigator.clipboard.writeText(profile.email)
		toast.success(t('profile.emailCopied'))
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const getRoleLabel = () => {
		if (profile.isSuperAdmin) {
			return t('profile.role.superAdmin')
		}
		if (profile.isAdmin) {
			return t('profile.role.admin')
		}
		return t('profile.role.user')
	}

	return (
		<div className={styles.card}>
			<div className={styles.avatarSection}>
				<div
					className={styles.avatarWrapper}
					onClick={onEditClick}
					title={t('profile.edit')}
				>
					<Avatar
						src={avatarUrl}
						alt={profile.name || profile.email}
						className={styles.avatar}
						key={`${profile.avatar}-${profile.updatedAt}`}
					>
						{!profile.avatar && <AccountCircleIcon />}
					</Avatar>
				</div>
			</div>

			<div className={styles.infoSection}>
				<InfoRow
					label={t('labels.name')}
					value={profile.name || '—'}
					icon={<PersonIcon fontSize='small' />}
				/>
				<InfoRow
					label={t('labels.email')}
					value={profile.email}
					icon={<EmailIcon fontSize='small' />}
					onCopy={handleCopyEmail}
				/>
				<InfoRow
					label={t('profile.position')}
					value={profile.position || '—'}
					icon={<WorkIcon fontSize='small' />}
				/>
				<InfoRow
					label={t('profile.role.label')}
					value={
						<Chip
							label={getRoleLabel()}
							icon={<ShieldIcon />}
							size='small'
							color={
								profile.isSuperAdmin
									? 'error'
									: profile.isAdmin
										? 'primary'
										: 'default'
							}
						/>
					}
					icon={<ShieldIcon fontSize='small' />}
				/>
				<InfoRow
					label={t('profile.dates.created')}
					value={formatDate(profile.createdAt)}
					icon={<CalendarTodayIcon fontSize='small' />}
				/>
				<InfoRow
					label={t('profile.dates.updated')}
					value={formatDate(profile.updatedAt)}
					icon={<UpdateIcon fontSize='small' />}
				/>
			</div>

			<div className={styles.actionsSection}>
				<Button
					variant='contained'
					startIcon={<EditIcon />}
					onClick={onEditClick}
				>
					{t('profile.edit')}
				</Button>
				<Button
					variant='outlined'
					startIcon={<LockIcon />}
					onClick={onChangePasswordClick}
				>
					{t('profile.security.changePassword')}
				</Button>
			</div>
		</div>
	)
}
