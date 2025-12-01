import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { TextField } from '@mui/material'
import { useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import styles from './EditProfileModal.module.css'
import { useUploadAvatar } from '@/entities/user'
import type { IProfileResponse, IUser } from '@/entities/user'
import { AppButton, AppModal } from '@/shared/ui'

interface EditProfileModalProps {
	open: boolean
	onClose: () => void
	profile: IProfileResponse
	onUpdate: (data: Partial<IUser>) => void
	isUpdating: boolean
}

type ProfileFormData = {
	name?: string
	position?: string
	avatar?: string
}

export const EditProfileModal = ({
	open,
	onClose,
	profile,
	onUpdate,
	isUpdating
}: EditProfileModalProps) => {
	const { t } = useTranslation('common')
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar()

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<ProfileFormData>({
		defaultValues: {
			name: profile.name || '',
			position: profile.position || '',
			avatar: profile.avatar || ''
		}
	})

	const handleFormSubmit = (data: ProfileFormData) => {
		const updateData: Partial<IUser> = {}

		if (data.name !== undefined && data.name !== (profile.name || '')) {
			updateData.name = data.name.trim() || undefined
		}
		if (
			profile.isAdmin &&
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
			onClose()
			reset()
		} else {
			onClose()
		}
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
				onClose()
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

	const handleClose = () => {
		reset()
		onClose()
	}

	return (
		<AppModal
			open={open}
			onClose={handleClose}
			title={t('profile.edit')}
			variant='primary'
		>
			<form
				onSubmit={handleSubmit(handleFormSubmit)}
				className={styles.form}
			>
				<div className={styles.uploadSection}>
					<input
						ref={fileInputRef}
						type='file'
						accept='image/jpeg,image/png,image/gif,image/webp'
						style={{ display: 'none' }}
						onChange={handleFileSelect}
						disabled={isUploading || isUpdating}
					/>
					<AppButton
						variant='secondary'
						startIcon={<CloudUploadIcon />}
						onClick={handleUploadClick}
						disabled={isUploading || isUpdating}
						fullWidth
					>
						{isUploading
							? t('messages.uploading')
							: t('profile.avatar.uploadFromDevice')}
					</AppButton>
				</div>

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

				<Controller
					name='position'
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label={t('profile.position')}
							variant='outlined'
							fullWidth
							disabled={isUpdating || !profile.isAdmin}
							margin='normal'
							placeholder={t('placeholders.position')}
						/>
					)}
				/>

				<div className={styles.actions}>
					<AppButton
						type='button'
						onClick={handleClose}
						variant='secondary'
						disabled={isUpdating || isUploading}
					>
						{t('buttons.cancel')}
					</AppButton>
					<AppButton
						type='submit'
						variant='primary'
						disabled={isUpdating || isUploading}
					>
						{isUpdating ? t('messages.saving') : t('buttons.save')}
					</AppButton>
				</div>
			</form>
		</AppModal>
	)
}
