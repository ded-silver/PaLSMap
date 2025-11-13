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
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Cell } from './Cell'
import TableDialog from './TableDialog'
import { useGetNodeData } from '@/entities/node-data'
import type { NodeData } from '@/entities/node-data'
import { useDialog } from '@/shared/hooks'
import { useDataGridLocaleText } from '@/shared/i18n/useDataGridLocaleText'

interface Props {
	open: boolean
	id: string
	dialogName: string
	handleClose: () => void
}

export const DialogData = ({ id, open, handleClose, dialogName }: Props) => {
	const { t } = useTranslation('nodes')
	const { items, isLoading } = useGetNodeData(id)
	const [pageSize, setPageSize] = useState<number>(10)
	const [page, setPage] = useState<number>(0)
	const localeText = useDataGridLocaleText()

	const { isOpen, handleDialogOpen, handleDialogClose } = useDialog()

	const isAdmin = localStorage.getItem('isAdmin')

	const exportJsonToExcel = async (jsonData: any[], filename = 'data.xlsx') => {
		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Sheet1')

		// Определяем колонки
		worksheet.columns = [
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
		]

		// Добавляем данные
		jsonData.forEach(item => {
			worksheet.addRow({
				protectionName: item.protectionName,
				excerpt: item.excerpt,
				source: item.source,
				triggeringConditions: item.triggeringConditions,
				triggeringAlgorithm: item.triggeringAlgorithm
			})
		})

		// Стилизация шапки (первая строка)
		const headerRow = worksheet.getRow(1)
		headerRow.eachCell(cell => {
			cell.font = { bold: true, color: { argb: 'FFFFFFFF' } } // белый цвет текста
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FF4472C4' } // синий фон
			}
			cell.alignment = {
				horizontal: 'center',
				vertical: 'middle',
				wrapText: true
			}
			cell.border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' }
			}
		})

		// Для всех остальных ячеек - перенос строк и выравнивание по левому краю
		worksheet.eachRow((row, rowNumber) => {
			if (rowNumber !== 1) {
				row.eachCell(cell => {
					cell.alignment = {
						horizontal: 'left', // по левому краю
						vertical: 'top',
						wrapText: true
					}
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					}
				})
			}
		})

		// Записываем в буфер и сохраняем
		const buffer = await workbook.xlsx.writeBuffer()
		const blob = new Blob([buffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		})

		saveAs(blob, filename)
	}

	const columns: GridColDef[] = useMemo(
		() => [
			// Отображение с учетом дочерних объектов

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
						sx={{
							whiteSpace: 'pre-line',
							wordBreak: 'break-word',
							hyphens: 'auto'
						}}
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
						sx={{
							whiteSpace: 'pre-line',
							wordBreak: 'break-word',
							hyphens: 'auto'
						}}
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
						sx={{
							whiteSpace: 'pre-line',
							wordBreak: 'break-word',
							hyphens: 'auto'
						}}
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
						sx={{
							whiteSpace: 'pre-line',
							wordBreak: 'break-word',
							hyphens: 'auto'
						}}
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
						sx={{
							whiteSpace: 'pre-line',
							wordBreak: 'break-word',
							hyphens: 'auto'
						}}
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
						backgroundColor: '#e6f0ff' // светло-серый фон
					}
				}}
			>
				<DialogTitle
					style={{ textAlign: 'center', width: '100%' }}
					sx={{
						backgroundColor: '#0073e6', // темно-синий
						color: '#fff'
					}}
				>
					<Typography sx={{ fontSize: '2.125rem' }}>{dialogName}</Typography>
					<IconButton
						aria-label='close'
						onClick={handleClose}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8
						}}
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
						<Grid
							item
							xs={12}
							sx={{ display: 'flex', flexDirection: 'column' }}
						>
							<div
								style={{
									display: 'flex',
									justifyContent: 'flex-end',
									marginBottom: '8px'
								}}
							></div>
							<Box
								sx={{
									textAlign: 'center',
									mb: 2
								}}
							>
								<Typography sx={{ fontSize: '2.125rem' }}>
									{t('tableTitle')}
								</Typography>

								<Box
									sx={{
										mt: 2,
										display: 'flex',
										justifyContent: 'right',
										gap: '1rem',
										flexWrap: 'wrap'
									}}
								>
									{isAdmin === 'true' && (
										<Button
											onClick={handleDialogOpen}
											variant='contained'
											startIcon={<AddIcon />}
										>
											{t('actions.add')}
										</Button>
									)}
									<Button
										onClick={() =>
											exportJsonToExcel(items, t('excel.fileName'))
										}
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
									isAdmin === 'true'
										? [
												{
													field: 'deleteEdit',
													headerName: '',
													minWidth: 100,
													maxWidth: 100,
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
								pageSizeOptions={[5, 10, 15, 20]}
								localeText={localeText}
								getRowHeight={() => 'auto'}
								sx={{
									'& .MuiDataGrid-row:nth-of-type(odd)': {
										backgroundColor: '#e6f0ff'
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
