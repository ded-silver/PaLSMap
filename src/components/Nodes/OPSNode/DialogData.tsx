import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SaveIcon from '@mui/icons-material/Save'
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useNodeById } from '../../../hooks/nodes/useNodes'
import { NodeDto, NodeService } from '../../../services/node.service'
import Provider from '../../Provider/Provider'

interface Props {
	open: boolean
	id: string
	dialogName: string
	handleClose: () => void
}

export const DialogData = ({ id, open, handleClose, dialogName }: Props) => {
	const { item } = useNodeById(id)
	const [columns, setColumns] = useState<string[]>([])
	const [rows, setRows] = useState<Array<{ [key: string]: string }>>([])
	const queryClient = useQueryClient()

	const { mutate: updateCurrentNode } = useMutation({
		mutationKey: ['updateCurrentNode'],
		mutationFn: (data: NodeDto) =>
			NodeService.update(data.id, {
				...data,
				data: {
					...data.data,
					tableName: columns,
					tableData: rows
				}
			}),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['node'] })
		},
		onError: error => {
			toast.error('Login or registration failed.')
		}
	})

	const handleChangeColumn = (index: number, newValue: string) => {
		setColumns(prev => {
			const updated = [...prev]
			const oldKey = prev[index]
			const newKey = newValue.trim()

			// Переименовать ключи в каждой строке
			setRows(rows =>
				rows.map(row => {
					const newRow = { ...row }
					newRow[newKey] = newRow[oldKey]
					delete newRow[oldKey]
					return newRow
				})
			)

			updated[index] = newKey
			return updated
		})
	}

	const handleChangeCell = (
		rowIdx: number,
		columnKey: string,
		newValue: string
	) => {
		setRows(prev => {
			const updated = [...prev]
			updated[rowIdx] = { ...updated[rowIdx], [columnKey]: newValue }
			return updated
		})
	}

	const handleAddRow = () => {
		const newRow: { [key: string]: string } = {}
		columns.forEach(col => {
			newRow[col] = ''
		})
		setRows(prev => [...prev, newRow])
	}

	const handleDeleteRow = (index: number) => {
		setRows(prev => prev.filter((_, i) => i !== index))
	}

	const handleAddColumn = () => {
		const newColumnName = `Новая колонка ${columns.length + 1}`
		setColumns(prev => [...prev, newColumnName])

		setRows(prevRows =>
			prevRows.map(row => ({
				...row,
				[newColumnName]: ''
			}))
		)
	}

	const handleSave = () => {
		updateCurrentNode(item as unknown as NodeDto)
	}

	useEffect(() => {
		if (item) {
			setColumns(item.data.tableName)
			setRows(item.data.tableData)
		}
	}, [item])

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
			fullScreen
		>
			<DialogTitle>
				{dialogName}
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
						<Provider id={id} />
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
						>
							<Button
								variant='contained'
								onClick={handleSave}
							>
								<SaveIcon />
							</Button>
						</div>
						
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										{columns.map((col, colIdx) => (
											<TableCell
												sx={{ minWidth: 200 }}
												key={colIdx}
											>
												<TextField
													value={col}
													onChange={e =>
														handleChangeColumn(colIdx, e.target.value)
													}
													variant='standard'
													fullWidth
													multiline
													maxRows={4}
													InputProps={{
														sx: {
															whiteSpace: 'nowrap',
															overflow: 'hidden',
															textOverflow: 'ellipsis'
														}
													}}
													inputProps={{ title: col }}
												/>
											</TableCell>
										))}
										<TableCell sx={{ mnWidth: 200 }}>
											<IconButton onClick={handleAddColumn}>
												<AddIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{rows.map((row, rowIdx) => (
										<TableRow key={rowIdx}>
											{columns.map((col, colIdx) => (
												<TableCell
													sx={{ minWidth: 200 }}
													key={colIdx}
												>
													<TextField
														value={row[col] ?? ''}
														onChange={e =>
															handleChangeCell(rowIdx, col, e.target.value)
														}
														variant='standard'
														fullWidth
														multiline
														maxRows={4}
														InputProps={{
															sx: {
																whiteSpace: 'nowrap',
																overflow: 'hidden',
																textOverflow: 'ellipsis'
															}
														}}
														inputProps={{ title: row[col] }}
													/>
												</TableCell>
											))}
											<TableCell sx={{ minWidth: 200 }}>
												<IconButton onClick={() => handleDeleteRow(rowIdx)}>
													<DeleteOutlineIcon />
												</IconButton>
											</TableCell>
										</TableRow>
									))}

									<TableRow>
										<TableCell colSpan={columns.length + 1}>
											<Button onClick={handleAddRow}>Добавить строку</Button>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	)
}
