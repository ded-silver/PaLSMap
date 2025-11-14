import { CircularProgress, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import styles from './ProfilePage.module.css'
import {
	useChangePassword,
	useUpdateProfile,
	useUserProfile
} from '@/entities/user'
import { MUI_STYLES } from '@/shared/styles/constants'
import { ChangePasswordForm } from '@/widgets/profile/ChangePasswordForm'
import { ProfileActions } from '@/widgets/profile/ProfileActions'
import { ProfileHeader } from '@/widgets/profile/ProfileHeader'

export const ProfilePage = () => {
	const { t } = useTranslation('common')
	const { data: profile, isLoading, error } = useUserProfile()
	const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
	const { mutate: changePassword, isPending: isChangingPassword } =
		useChangePassword()

	if (isLoading) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>
					<CircularProgress />
				</div>
			</div>
		)
	}

	if (error || !profile) {
		return (
			<div className={styles.container}>
				<div className={styles.error}>{t('errors.loadError')}</div>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<Typography
				variant='h4'
				className={styles.title}
				sx={MUI_STYLES.typography.titleLarge}
			>
				{t('profile.title')}
			</Typography>

			<ProfileHeader
				profile={profile}
				onUpdate={updateProfile}
				isUpdating={isUpdating}
			/>

			<ChangePasswordForm
				onChangePassword={changePassword}
				isChanging={isChangingPassword}
			/>

			<ProfileActions isAdmin={profile.isAdmin} />
		</div>
	)
}
