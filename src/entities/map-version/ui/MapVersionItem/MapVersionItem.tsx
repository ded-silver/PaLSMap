import DeleteIcon from '@mui/icons-material/Delete'
import RestoreIcon from '@mui/icons-material/Restore'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
	Box,
	Card,
	CardContent,
	Chip,
	DialogContentText,
	IconButton,
	Tooltip,
	Typography
} from '@mui/material'
import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import styles from './MapVersionItem.module.css'
import {
	type MapVersion,
	getErrorMessage,
	getMapVersionUrl,
	useDeleteVersion,
	useRestoreVersion
} from '@/entities/map-version'
import { useIsAdmin } from '@/entities/user'
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime'
import { AppModal } from '@/shared/ui'
import { AppButton } from '@/shared/ui'

interface MapVersionItemProps {
	version: MapVersion
	onView?: () => void
}

export const MapVersionItem = memo(
	({ version, onView }: MapVersionItemProps) => {
		const { t } = useTranslation(['map-versions', 'common'])
		const { countryId, areaId } = useParams<{
			countryId?: string
			areaId?: string
		}>()
		const navigate = useNavigate()
		const isAdmin = useIsAdmin()

		const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)
		const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

		const { mutate: restoreVersion, isPending: isRestoring } =
			useRestoreVersion()
		const { mutate: deleteVersion, isPending: isDeleting } = useDeleteVersion()

		const { relativeTime, userName, nodeCount } = useMemo(() => {
			const relative = formatRelativeTime(version.createdAt, t, 'map-versions')
			const user =
				version.createdBy?.name ||
				version.createdBy?.email ||
				t('messages.unknownUser', { ns: 'map-versions' })
			const count = version.nodeCount ?? version.snapshot?.nodes?.length ?? 0

			return {
				relativeTime: relative,
				userName: user,
				nodeCount: count
			}
		}, [version, t])

		const handleView = useCallback(() => {
			if (onView) {
				onView()
			} else if (countryId && areaId) {
				navigate(getMapVersionUrl(countryId, areaId, version.id))
			}
		}, [onView, countryId, areaId, navigate, version.id])

		const handleRestoreClick = useCallback(() => {
			setIsRestoreModalOpen(true)
		}, [])

		const handleRestoreConfirm = useCallback(() => {
			restoreVersion(version.id, {
				onSuccess: () => {
					setIsRestoreModalOpen(false)
					toast.success(t('messages.versionRestored', { ns: 'map-versions' }))
					if (countryId && areaId) {
						navigate(getMapVersionUrl(countryId, areaId), { replace: true })
					}
				},
				onError: (error: unknown) => {
					toast.error(
						getErrorMessage(
							error,
							t('messages.restoreError', { ns: 'map-versions' })
						)
					)
				}
			})
		}, [restoreVersion, version.id, countryId, areaId, navigate, t])

		const handleDeleteClick = useCallback(() => {
			setIsDeleteModalOpen(true)
		}, [])

		const handleDeleteConfirm = useCallback(() => {
			deleteVersion(version.id, {
				onSuccess: () => {
					setIsDeleteModalOpen(false)
					toast.success(t('messages.versionDeleted', { ns: 'map-versions' }))
				},
				onError: (error: unknown) => {
					toast.error(
						getErrorMessage(
							error,
							t('messages.deleteError', { ns: 'map-versions' })
						)
					)
				}
			})
		}, [deleteVersion, version.id, t])

		return (
			<>
				<Card className={`${styles.card} ${styles['card-hover']}`}>
					<CardContent className={styles.content}>
						<Box className={styles.header}>
							<Box className={styles.info}>
								<Box className={styles.topRow}>
									<Typography
										variant='h6'
										className={styles.name}
									>
										{version.name}
									</Typography>
									<Chip
										label={t('labels.version', { ns: 'map-versions' })}
										size='small'
										sx={{
											fontSize: '11px',
											height: '22px'
										}}
									/>
								</Box>
								{version.description && (
									<Typography
										variant='body2'
										className={styles.description}
									>
										{version.description}
									</Typography>
								)}
								<Box className={styles.meta}>
									<Typography
										variant='caption'
										className={styles.metaItem}
									>
										{t('info.nodeCount', {
											ns: 'map-versions',
											count: nodeCount
										})}
									</Typography>
									<Typography
										variant='caption'
										className={styles.metaItem}
									>
										{userName}
									</Typography>
									<Typography
										variant='caption'
										className={styles.metaItem}
									>
										{relativeTime}
									</Typography>
								</Box>
							</Box>
							<Box className={styles.actions}>
								<Tooltip title={t('labels.view', { ns: 'map-versions' })}>
									<IconButton
										size='small'
										onClick={handleView}
										className={styles.actionButton}
									>
										<VisibilityIcon />
									</IconButton>
								</Tooltip>
								{isAdmin && (
									<>
										<Tooltip
											title={t('labels.restoreVersion', {
												ns: 'map-versions'
											})}
										>
											<IconButton
												size='small'
												onClick={handleRestoreClick}
												className={styles.actionButton}
											>
												<RestoreIcon />
											</IconButton>
										</Tooltip>
										<Tooltip
											title={t('labels.deleteVersion', {
												ns: 'map-versions'
											})}
										>
											<IconButton
												size='small'
												onClick={handleDeleteClick}
												className={styles.actionButton}
												color='error'
											>
												<DeleteIcon />
											</IconButton>
										</Tooltip>
									</>
								)}
							</Box>
						</Box>
					</CardContent>
				</Card>

				{isAdmin && (
					<>
						<AppModal
							open={isRestoreModalOpen}
							onClose={() => setIsRestoreModalOpen(false)}
							title={t('labels.restoreVersion', { ns: 'map-versions' })}
							variant='primary'
							actions={
								<>
									<AppButton
										onClick={() => setIsRestoreModalOpen(false)}
										disabled={isRestoring}
										variant='secondary'
									>
										{t('buttons.cancel', { ns: 'common' })}
									</AppButton>
									<AppButton
										onClick={handleRestoreConfirm}
										loading={isRestoring}
										disabled={isRestoring}
										variant='primary'
									>
										{isRestoring
											? t('messages.restoring', { ns: 'map-versions' })
											: t('labels.restoreVersion', { ns: 'map-versions' })}
									</AppButton>
								</>
							}
						>
							<DialogContentText sx={{ marginTop: '16px' }}>
								{t('confirmations.restoreVersion', {
									ns: 'map-versions',
									name: version.name
								})}
							</DialogContentText>
						</AppModal>

						<AppModal
							open={isDeleteModalOpen}
							onClose={() => setIsDeleteModalOpen(false)}
							title={t('labels.deleteVersion', { ns: 'map-versions' })}
							variant='error'
							actions={
								<>
									<AppButton
										onClick={() => setIsDeleteModalOpen(false)}
										disabled={isDeleting}
										variant='secondary'
									>
										{t('buttons.cancel', { ns: 'common' })}
									</AppButton>
									<AppButton
										onClick={handleDeleteConfirm}
										loading={isDeleting}
										disabled={isDeleting}
										variant='danger'
									>
										{isDeleting
											? t('messages.deleting', { ns: 'common' })
											: t('buttons.delete', { ns: 'common' })}
									</AppButton>
								</>
							}
						>
							<DialogContentText sx={{ marginTop: '16px' }}>
								{t('confirmations.deleteVersion', { ns: 'map-versions' })}{' '}
								<b>{version.name}</b>?
							</DialogContentText>
						</AppModal>
					</>
				)}
			</>
		)
	}
)

MapVersionItem.displayName = 'MapVersionItem'
