import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
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
import { ruRU } from '@mui/x-data-grid/locales'
import { useMemo, useState } from 'react'

import { useGetNodeData } from '../../../hooks/nodes/useNodes'
import { useDialog } from '../../../hooks/useDialog'
import { NodeData } from '../../../types/nodeTypes'
import Provider from '../../Provider/Provider'

import { Cell } from './Cell'
import TableDialog from './TableDialog'

interface Props {
	open: boolean
	id: string
	dialogName: string
	handleClose: () => void
	currentNodeType: 'OPS' | 'TankPark' | 'Checkpoint'
}

export const DialogData = ({
	id,
	open,
	handleClose,
	dialogName,
	currentNodeType
}: Props) => {
	const { items, isLoading } = useGetNodeData(id)
	const [pageSize, setPageSize] = useState<number>(10)
	const [page, setPage] = useState<number>(0)

	const { isOpen, handleDialogOpen, handleDialogClose } = useDialog()

	const isAdmin = localStorage.getItem('isAdmin')

	const columns: GridColDef[] = useMemo(
		() => [
			// Отображение с учетом дочерних объектов
			// {
			// 	field: '',
			// 	headerName: 'Объект защиты',
			// 	flex: 0,
			// 	minWidth: 150,
			// 	maxWidth: 350,
			// 	renderCell: params => (
			// 		<Box
			// 			width='100%'
			// 			height='100%'
			// 			display='flex'
			// 			justifyContent='center'
			// 			alignItems='center'
			// 			sx={{
			// 				whiteSpace: 'pre-line',
			// 				wordBreak: 'break-word',
			// 				hyphens: 'auto'
			// 			}}
			// 		>
			// 			{params.value}
			// 		</Box>
			// 	)
			// },
			{
				field: 'excerpt',
				headerName: 'Название защиты',
				flex: 0,
				minWidth: 150,
				maxWidth: 350,
				renderCell: params => (
					<Box
						width='100%'
						height='100%'
						display='flex'
						justifyContent='center'
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
				field: 'protectionName',
				headerName: 'Выдержка',
				flex: 1,
				minWidth: 100,
				maxWidth: 100,
				renderCell: params => (
					<Box
						width='100%'
						height='100%'
						display='flex'
						justifyContent='center'
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
				field: 'source',
				headerName: 'Источник',
				flex: 0,
				minWidth: 150,
				maxWidth: 350,
				renderCell: params => (
					<Box
						width='100%'
						height='100%'
						display='flex'
						justifyContent='center'
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
				field: 'triggeringAlgorithm',
				headerName: 'Условие срабатывания',
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
				headerName: 'Алгоритм срабатывания',
				flex: 1,
				minWidth: 150,
				renderCell: params => (
					<Box
						width='100%'
						height='100%'
						display='flex'
						justifyContent='center'
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
		[id, handleDialogClose]
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
							xs={6}
						>
							<Provider
								currentNodeType={currentNodeType}
								id={id}
							/>
						</Grid>
						<Grid
							item
							xs={6}
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
									position: 'relative',
									textAlign: 'center',
									mb: 2
								}}
							>
								<Typography sx={{ fontSize: '2.125rem' }}>
									Таблица уставок защит технологического объекта
								</Typography>

								{isAdmin === 'true' ? (
									<Box
										sx={{
											position: 'absolute',
											right: 0,
											top: '50%',
											transform: 'translateY(-50%)'
										}}
									>
										<Button
											onClick={handleDialogOpen}
											variant='contained'
											startIcon={<AddIcon />}
										>
											Добавить
										</Button>
									</Box>
								) : null}
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
								localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
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
