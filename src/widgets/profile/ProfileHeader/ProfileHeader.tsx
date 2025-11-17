import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ShieldIcon from '@mui/icons-material/Shield'
import {
	Avatar,
	Button,
	Chip,
	IconButton,
	InputAdornment,
	TextField,
	Typography
} from '@mui/material'
import { useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import styles from './ProfileHeader.module.css'
import { useUploadAvatar } from '@/entities/user'
import type { IProfileResponse, IUser } from '@/entities/user'
import { normalizeAvatarUrl } from '@/shared/lib'

interface ProfileHeaderProps {
	profile: IProfileResponse
	onUpdate: (data: Partial<IUser>) => void
	isUpdating: boolean
}

type ProfileFormData = {
	name?: string
	email: string
	position?: string
	avatar?: string
}

export const ProfileHeader = ({
	profile,
	onUpdate,
	isUpdating
}: ProfileHeaderProps) => {
	const { t } = useTranslation('common')
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar()

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<ProfileFormData>({
		defaultValues: {
			name: profile.name || '',
			email: profile.email,
			position: profile.position || '',
			avatar: profile.avatar || ''
		},
		mode: 'onChange'
	})

	const handleFormSubmit = (data: ProfileFormData) => {
		const updateData: Partial<IUser> = {}

		if (data.name !== undefined && data.name !== (profile.name || '')) {
			updateData.name = data.name.trim() || undefined
		}
		if (
			data.position !== undefined &&
			data.position !== (profile.position || '')
		) {
			updateData.position = data.position.trim() || undefined
		}
		if (data.avatar !== undefined && data.avatar !== (profile.avatar || '')) {
			updateData.avatar = data.avatar.trim() || undefined
		}

		if (Object.keys(updateData).length > 0) {
			onUpdate(updateData)
		}
	}

	const handleCopyEmail = () => {
		navigator.clipboard.writeText(profile.email)
		toast.success(t('profile.emailCopied'))
	}

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error(t('profile.avatar.invalidFileType'))
			return
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error(t('profile.avatar.fileTooLarge'))
			return
		}

		uploadAvatar(file, {
			onSuccess: () => {
				if (fileInputRef.current) {
					fileInputRef.current.value = ''
				}
			},
			onError: () => {
				if (fileInputRef.current) {
					fileInputRef.current.value = ''
				}
			}
		})
	}

	const handleUploadClick = () => {
		fileInputRef.current?.click()
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

	const avatarUrl = normalizeAvatarUrl(profile.avatar, profile.updatedAt)

	return (
		<div className={styles.container}>
			<div className={styles.avatarSection}>
				<Avatar
					src={avatarUrl}
					alt={profile.name || profile.email}
					className={styles.avatar}
					key={`${profile.avatar}-${profile.updatedAt}`}
				>
					{!profile.avatar && <AccountCircleIcon />}
				</Avatar>
				<div className={styles.avatarControls}>
					<input
						ref={fileInputRef}
						type='file'
						accept='image/jpeg,image/png,image/gif,image/webp'
						style={{ display: 'none' }}
						onChange={handleFileSelect}
						disabled={isUploading || isUpdating}
					/>
					<Button
						variant='outlined'
						startIcon={<CloudUploadIcon />}
						onClick={handleUploadClick}
						disabled={isUploading || isUpdating}
						size='small'
					>
						{isUploading
							? t('messages.uploading')
							: t('profile.avatar.uploadFromDevice')}
					</Button>
				</div>
			</div>

			<form
				onSubmit={handleSubmit(handleFormSubmit)}
				className={styles.form}
			>
				<div className={styles.formRow}>
					<Controller
						name='avatar'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('profile.avatar.url')}
								variant='outlined'
								fullWidth
								disabled={isUpdating}
								margin='normal'
								placeholder='https://example.com/avatar.jpg'
								helperText={t('profile.avatar.urlHint')}
							/>
						)}
					/>
				</div>

				<div className={styles.formRow}>
					<Controller
						name='name'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('labels.name')}
								variant='outlined'
								fullWidth
								disabled={isUpdating}
								margin='normal'
							/>
						)}
					/>
				</div>

				<div className={styles.formRow}>
					<Controller
						name='email'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('labels.email')}
								variant='outlined'
								fullWidth
								disabled
								margin='normal'
								InputProps={{
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton
												onClick={handleCopyEmail}
												edge='end'
												aria-label={t('buttons.copy', {
													defaultValue: 'Копировать'
												})}
											>
												<ContentCopyIcon />
											</IconButton>
										</InputAdornment>
									)
								}}
							/>
						)}
					/>
				</div>

				<div className={styles.formRow}>
					<Controller
						name='position'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('profile.position')}
								variant='outlined'
								fullWidth
								disabled={isUpdating}
								margin='normal'
								placeholder={t('placeholders.position')}
							/>
						)}
					/>
				</div>

				<div className={styles.roleSection}>
					<Chip
						icon={<ShieldIcon />}
						label={
							profile.isAdmin ? t('profile.role.admin') : t('profile.role.user')
						}
						color={profile.isAdmin ? 'primary' : 'default'}
						className={styles.roleChip}
					/>
				</div>

				<div className={styles.datesSection}>
					<Typography
						variant='body2'
						className={styles.dateLabel}
					>
						{t('profile.registered')}:{' '}
						<span className={styles.dateValue}>
							{formatDate(profile.createdAt)}
						</span>
					</Typography>
					<Typography
						variant='body2'
						className={styles.dateLabel}
					>
						{t('profile.updated')}:{' '}
						<span className={styles.dateValue}>
							{formatDate(profile.updatedAt)}
						</span>
					</Typography>
				</div>

				<div className={styles.actions}>
					<Button
						type='submit'
						variant='contained'
						color='primary'
						disabled={isUpdating}
					>
						{isUpdating ? t('messages.saving') : t('buttons.save')}
					</Button>
				</div>
			</form>
		</div>
	)
}
