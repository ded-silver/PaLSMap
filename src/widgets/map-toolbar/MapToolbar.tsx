import BookmarkIcon from '@mui/icons-material/Bookmark'
import HistoryIcon from '@mui/icons-material/History'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import RestoreIcon from '@mui/icons-material/Restore'
import {
	Box,
	CircularProgress,
	DialogContentText,
	FormControl,
	IconButton,
	MenuItem,
	Select,
	SelectChangeEvent,
	Tooltip
} from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import styles from './MapToolbar.module.css'
import {
	getErrorMessage,
	getMapVersionUrl,
	getMapVersionsListUrl,
	useRestoreVersion,
	useVersionsByPathArea
} from '@/entities/map-version'
import { useIsAdmin } from '@/entities/user'
import { AppModal } from '@/shared/ui'
import { AppButton } from '@/shared/ui'
import { SaveVersionModal } from '@/widgets/save-version-modal'

interface Props {
	areaId: string | undefined
}

export const MapToolbar = ({ areaId }: Props) => {
	const { t } = useTranslation(['map-versions', 'common'])
	const { countryId } = useParams<{ countryId?: string }>()
	const [searchParams, setSearchParams] = useSearchParams()
	const navigate = useNavigate()
	const isAdmin = useIsAdmin()

	const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
	const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)

	const versionId = searchParams.get('version')
	const isVersionViewMode = !!versionId

	const { data: versions, isLoading: isLoadingVersions } =
		useVersionsByPathArea(areaId)

	const currentVersion = useMemo(
		() => versions?.find(v => v.id === versionId),
		[versions, versionId]
	)

	const { mutate: restoreVersion, isPending: isRestoring } = useRestoreVersion()

	const handleVersionChange = useCallback(
		(event: SelectChangeEvent<string>) => {
			const newVersionId = event.target.value

			if (newVersionId === 'current') {
				const newSearchParams = new URLSearchParams(searchParams)
				newSearchParams.delete('version')
				setSearchParams(newSearchParams, { replace: true })
			} else {
				const newSearchParams = new URLSearchParams(searchParams)
				newSearchParams.set('version', newVersionId)
				setSearchParams(newSearchParams, { replace: true })
			}
		},
		[searchParams, setSearchParams]
	)

	const handleSaveVersion = useCallback(() => {
		setIsSaveModalOpen(true)
	}, [])

	const handleExportPdf = useCallback(() => {
		toast.info(t('messages.pdfExportInDevelopment', { ns: 'map-versions' }))
	}, [t])

	const handleVersionsClick = useCallback(() => {
		if (countryId && areaId) {
			navigate(getMapVersionsListUrl(countryId, areaId))
		}
	}, [countryId, areaId, navigate])

	const handleSaveSuccess = useCallback(() => {
		setIsSaveModalOpen(false)
		toast.success(t('messages.versionSaved', { ns: 'map-versions' }))
	}, [t])

	const handleRestoreClick = useCallback(() => {
		setIsRestoreModalOpen(true)
	}, [])

	const handleRestoreConfirm = useCallback(() => {
		if (!versionId || !countryId || !areaId) return

		restoreVersion(versionId, {
			onSuccess: () => {
				setIsRestoreModalOpen(false)
				toast.success(t('messages.versionRestored', { ns: 'map-versions' }))
				const newSearchParams = new URLSearchParams(searchParams)
				newSearchParams.delete('version')
				const queryString = newSearchParams.toString()
				navigate(
					getMapVersionUrl(countryId, areaId) +
						(queryString ? `?${queryString}` : ''),
					{ replace: true }
				)
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
	}, [versionId, countryId, areaId, restoreVersion, searchParams, navigate, t])

	if (!areaId) {
		return null
	}

	return (
		<>
			<div className={styles.wrapper}>
				<Box className={styles.toolbar}>
					<Box className={styles['toolbar-content']}>
						{isAdmin && !isVersionViewMode && (
							<Tooltip title={t('labels.saveVersion', { ns: 'map-versions' })}>
								<IconButton
									onClick={handleSaveVersion}
									className={styles['toolbar-button']}
									size='small'
								>
									<BookmarkIcon />
								</IconButton>
							</Tooltip>
						)}

						{isAdmin && isVersionViewMode && currentVersion && (
							<Tooltip
								title={t('labels.restoreThisVersion', {
									ns: 'map-versions'
								})}
							>
								<IconButton
									onClick={handleRestoreClick}
									className={styles['toolbar-button']}
									size='small'
									aria-label={t('labels.restoreThisVersion', {
										ns: 'map-versions'
									})}
								>
									<RestoreIcon />
								</IconButton>
							</Tooltip>
						)}

						<FormControl
							size='small'
							sx={{
								minWidth: 180,
								'& .MuiOutlinedInput-root': {
									height: 36,
									background: 'var(--glass-blue-bg)',
									backdropFilter: 'var(--effect-blur)',
									border: '1px solid var(--glass-dark-border)',
									borderRadius: 'var(--border-radius-md)',
									boxShadow: 'var(--effect-shadow-blue)',
									'& fieldset': {
										borderColor: 'var(--glass-dark-border)'
									},
									'&:hover fieldset': {
										borderColor: 'var(--glass-dark-border)'
									},
									'&.Mui-focused fieldset': {
										borderColor: 'var(--glass-dark-border)'
									},
									'& .MuiSelect-select': {
										padding: '6px 32px 6px 12px',
										fontSize: 'var(--font-size-sm)',
										color: 'var(--glass-blue-text)'
									},
									'& .MuiSelect-icon': {
										color: 'var(--glass-blue-text)'
									}
								}
							}}
						>
							{isLoadingVersions ? (
								<Box className={styles['select-loading']}>
									<CircularProgress size={18} />
								</Box>
							) : (
								<Select
									value={versionId || 'current'}
									onChange={handleVersionChange}
									displayEmpty
									inputProps={{
										'aria-label': t('labels.selectVersion', {
											ns: 'map-versions'
										})
									}}
								>
									<MenuItem value='current'>
										{t('labels.currentVersion', { ns: 'map-versions' })}
									</MenuItem>
									{versions?.map(version => (
										<MenuItem
											key={version.id}
											value={version.id}
										>
											{version.name}
										</MenuItem>
									))}
								</Select>
							)}
						</FormControl>

						<Tooltip title={t('labels.exportPdf', { ns: 'map-versions' })}>
							<span>
								<IconButton
									onClick={handleExportPdf}
									className={styles['toolbar-button']}
									disabled
									size='small'
									aria-label={t('labels.exportPdf', { ns: 'map-versions' })}
								>
									<PictureAsPdfIcon />
								</IconButton>
							</span>
						</Tooltip>

						<Tooltip title={t('labels.versions', { ns: 'map-versions' })}>
							<IconButton
								onClick={handleVersionsClick}
								className={styles['toolbar-button']}
								size='small'
								aria-label={t('labels.versions', { ns: 'map-versions' })}
							>
								<HistoryIcon />
							</IconButton>
						</Tooltip>
					</Box>

					{currentVersion && (
						<Box className={styles['version-indicator']}>
							{t('info.viewingVersionMode', {
								ns: 'map-versions',
								name: currentVersion.name
							})}
						</Box>
					)}
				</Box>
			</div>

			{isAdmin && areaId && (
				<SaveVersionModal
					open={isSaveModalOpen}
					onClose={() => setIsSaveModalOpen(false)}
					pathAreaId={areaId}
					onSuccess={handleSaveSuccess}
				/>
			)}

			{isAdmin && currentVersion && (
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
							name: currentVersion.name
						})}
					</DialogContentText>
				</AppModal>
			)}
		</>
	)
}
