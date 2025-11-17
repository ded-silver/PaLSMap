import { CircularProgress, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './ProfilePage.module.css'
import {
	useChangePassword,
	useUpdateProfile,
	useUserProfile
} from '@/entities/user'
import { MUI_STYLES } from '@/shared/styles/constants'
import { ChangePasswordModal } from '@/widgets/profile/ChangePasswordModal'
import { EditProfileModal } from '@/widgets/profile/EditProfileModal'
import { ProfileActions } from '@/widgets/profile/ProfileActions'
import { ProfileView } from '@/widgets/profile/ProfileView'

export const ProfilePage = () => {
	const { t } = useTranslation('common')
	const { data: profile, isLoading, error } = useUserProfile()
	const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
	const { mutate: changePassword, isPending: isChangingPassword } =
		useChangePassword()

	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
		useState(false)

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
			<div className={styles.contentWrapper}>
				<Typography
					variant='h4'
					className={styles.title}
					sx={MUI_STYLES.typography.titleLarge}
				>
					{t('profile.title')}
				</Typography>

				<ProfileView
					profile={profile}
					onEditClick={() => setIsEditModalOpen(true)}
					onChangePasswordClick={() => setIsChangePasswordModalOpen(true)}
				/>

				<ProfileActions isAdmin={profile.isAdmin} />
			</div>

			<EditProfileModal
				open={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				profile={profile}
				onUpdate={updateProfile}
				isUpdating={isUpdating}
			/>

			<ChangePasswordModal
				open={isChangePasswordModalOpen}
				onClose={() => setIsChangePasswordModalOpen(false)}
				onChangePassword={changePassword}
				isChanging={isChangingPassword}
			/>
		</div>
	)
}
