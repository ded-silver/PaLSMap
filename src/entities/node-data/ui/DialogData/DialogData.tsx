import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	Typography
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Suspense, lazy, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Cell } from './Cell'
import TableDialog from './TableDialog'
import { useGetNodeData } from '@/entities/node-data'
import type { NodeData } from '@/entities/node-data'
import { useIsAdmin } from '@/entities/user'
import { useDialog } from '@/shared/hooks'
import { useDataGridLocaleText } from '@/shared/i18n/useDataGridLocaleText'
import { exportToExcel } from '@/shared/lib/excel-export'
import { COLORS, MUI_STYLES, SIZES } from '@/shared/styles/constants'

const Provider = lazy(() =>
	import('@/components/Provider/Provider').then(module => ({
		default: module.default
	}))
)

interface Props {
	open: boolean
	id: string
	dialogName: string
	handleClose: () => void
	currentNodeType?: 'OPS' | 'TankPark' | 'Checkpoint'
}

export const DialogData = ({
	id,
	open,
	handleClose,
	dialogName,
	currentNodeType
}: Props) => {
	const { t } = useTranslation('nodes')
	const { items, isLoading } = useGetNodeData(id)
	const [pageSize, setPageSize] = useState<number>(SIZES.defaultPageSize)
	const [page, setPage] = useState<number>(0)
	const localeText = useDataGridLocaleText()

	const { isOpen, handleDialogOpen, handleDialogClose } = useDialog()

	const isAdmin = useIsAdmin()

	const handleExportToExcel = async () => {
		await exportToExcel({
			columns: [
				{ header: t('excel.protectionName'), key: 'protectionName', width: 40 },
				{ header: t('excel.excerpt'), key: 'excerpt', width: 40 },
				{ header: t('excel.source'), key: 'source', width: 40 },
				{
					header: t('excel.triggeringConditions'),
					key: 'triggeringConditions',
					width: 60
				},
				{
					header: t('excel.triggeringAlgorithm'),
					key: 'triggeringAlgorithm',
					width: 70
				}
			],
			data: items,
			filename: t('excel.fileName')
		})
	}

	const columns: GridColDef[] = useMemo(
		() => [
			{
				field: 'protectionName',
				headerName: t('fields.protectionName'),
				flex: 0,
				minWidth: 250,
				maxWidth: 350,
				renderCell: params => (
					<Box
						width='100%'
						height='100%'
						display='flex'
						justifyContent='left'
						alignItems='center'
						sx={MUI_STYLES.textWrap}
					>
						{params.value}
					</Box>
				)
			},
			{
				field: 'excerpt',
				headerName: t('fields.excerpt'),
				flex: 0,
				minWidth: 150,
				maxWidth: 200,
				renderCell: params => (
					<Box
						width='100%'
						height='100%'
						display='flex'
						justifyContent='center'
						alignItems='center'
						textAlign='center'
						sx={MUI_STYLES.textWrap}
					>
						{params.value}
					</Box>
				)
			},
			{
				field: 'source',
				headerName: t('fields.source'),
				flex: 0,
				minWidth: 150,
				maxWidth: 350,
				renderCell: params => (
					<Box
						width='100%'
						height='100%'
						display='flex'
						justifyContent='left'
						alignItems='center'
						sx={MUI_STYLES.textWrap}
					>
						{params.value}
					</Box>
				)
			},
			{
				field: 'triggeringConditions',
				headerName: t('fields.triggeringConditions'),
				flex: 0,
				minWidth: 250,
				maxWidth: 450,
				renderCell: params => (
					<Box
						width='100%'
						height='100%'
						display='flex'
						justifyContent='center'
						alignItems='center'
						textAlign='center'
						sx={MUI_STYLES.textWrap}
					>
						{params.value}
					</Box>
				)
			},
			{
				field: 'triggeringAlgorithm',
				headerName: t('fields.triggeringAlgorithm'),
				flex: 1,
				minWidth: 150,
				renderCell: params => (
					<Box
						width='100%'
						height='100%'
						display='flex'
						justifyContent='left'
						alignItems='center'
						sx={MUI_STYLES.textWrap}
					>
						{params.value}
					</Box>
				)
			}
		],
		[id, handleDialogClose, t]
	)

	const handlePaginationModelChange = (paginationModel: {
		page: number
		pageSize: number
	}) => {
		setPage(paginationModel.page)
		setPageSize(paginationModel.pageSize)
	}

	return (
		<>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
				fullScreen
				PaperProps={{
					sx: {
						backgroundColor: COLORS.background
					}
				}}
			>
				<DialogTitle sx={MUI_STYLES.dialogTitleCentered}>
					<Typography sx={MUI_STYLES.typography.titleLarge}>
						{dialogName}
					</Typography>
					<IconButton
						aria-label='close'
						onClick={handleClose}
						sx={MUI_STYLES.iconButtonClose}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>

				<DialogContent>
					<Grid
						container
						spacing={2}
						height='100%'
					>
						{currentNodeType && (
							<Grid
								item
								xs={6}
							>
								<Suspense fallback={<div>Загрузка...</div>}>
									<Provider
										currentNodeType={currentNodeType}
										id={id}
									/>
								</Suspense>
							</Grid>
						)}
						<Grid
							item
							xs={currentNodeType ? 6 : 12}
							sx={MUI_STYLES.flexColumn}
						>
							<Box
								sx={{
									...MUI_STYLES.flexRow,
									justifyContent: 'flex-end',
									...MUI_STYLES.spacing.mb1
								}}
							/>
							<Box
								sx={{
									textAlign: 'center',
									...MUI_STYLES.spacing.mb2
								}}
							>
								<Typography sx={MUI_STYLES.typography.titleLarge}>
									{t('tableTitle')}
								</Typography>

								<Box
									sx={{
										...MUI_STYLES.spacing.mt2,
										...MUI_STYLES.flexRow,
										justifyContent: 'right',
										...MUI_STYLES.spacing.gap1,
										flexWrap: 'wrap'
									}}
								>
									{isAdmin && (
										<Button
											onClick={handleDialogOpen}
											variant='contained'
											startIcon={<AddIcon />}
										>
											{t('actions.add')}
										</Button>
									)}
									<Button
										onClick={handleExportToExcel}
										variant='contained'
										startIcon={<FileDownloadIcon />}
									>
										{t('actions.saveToExcel')}
									</Button>
								</Box>
							</Box>

							<DataGrid
								disableRowSelectionOnClick
								loading={isLoading}
								autoHeight
								rows={items}
								columns={
									isAdmin
										? [
												{
													field: 'deleteEdit',
													headerName: '',
													minWidth: 100,
													maxWidth: 100,
													align: 'center',
													headerAlign: 'center',
													renderCell: ({ row }: { row: NodeData }) => (
														<Cell
															items={items}
															nodeId={id}
															row={row}
														/>
													)
												},
												...columns
											]
										: columns
								}
								paginationModel={{ page, pageSize }}
								onPaginationModelChange={handlePaginationModelChange}
								pageSizeOptions={SIZES.pageSizeOptions}
								localeText={localeText}
								getRowHeight={() => 'auto'}
								sx={{
									'& .MuiDataGrid-row:nth-of-type(odd)': {
										backgroundColor: COLORS.background
									},
									'& .MuiDataGrid-cell[data-field="deleteEdit"]': {
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center'
									}
								}}
							/>
						</Grid>
					</Grid>
				</DialogContent>
			</Dialog>
			<TableDialog
				items={items}
				nodeId={id}
				open={isOpen}
				handleClose={handleDialogClose}
			/>
		</>
	)
}
