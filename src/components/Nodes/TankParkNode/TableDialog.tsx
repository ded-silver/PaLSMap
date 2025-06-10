import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	TextField,
	Typography
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { NodeService } from '../../../services/node.service'
import { NodeData, NodeDataPayload } from '../../../types/nodeTypes'

const initialValues = {
	protectionName: '',
	excerpt: '',
	source: '',
	triggeringConditions: '',
	triggeringAlgorithm: ''
}

interface Props {
	open: boolean
	handleClose: () => void
	isDetails?: boolean
	row?: NodeData
	nodeId: string
	items: NodeData[]
}

export default function TableDialog({
	open,
	handleClose,
	isDetails,
	row,
	nodeId,
	items
}: Props) {
	const queryClient = useQueryClient()

	const { mutate: createNodeData } = useMutation({
		mutationKey: ['createNodeData'],
		mutationFn: (data: NodeDataPayload) => NodeService.createNodeData(data),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['currentNodeData'] })
		},
		onError: error => {
			toast.error('Ошибка при добавлении данных.')
		}
	})

	const { mutate: updateNodeData } = useMutation({
		mutationKey: ['updateNodeData'],
		mutationFn: (data: NodeData) => NodeService.updateNodeData(data),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['currentNodeData'] })
		},
		onError: error => {
			toast.error('Ошибка при обновлении.')
		}
	})

	const {
		formState: { errors },
		control,
		reset,
		handleSubmit
	} = useForm<NodeData>({
		mode: 'onBlur',
		defaultValues: initialValues
	})

	const onSubmit = (data: NodeData) => {
		if (!isDetails && !row) {
			createNodeData({
				id: nodeId,
				data: {
					...data,
					order: items.length
				}
			})
		} else {
			updateNodeData(data)
		}
		reset(initialValues)
		handleClose()
	}

	useEffect(() => {
		if (isDetails && row) {
			reset(row)
		}
	}, [isDetails, reset, row])
	return (
		<Dialog open={open}>
			<DialogTitle>
				<Typography sx={{ fontSize: '2.125rem' }}>Добавление</Typography>
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
				>
					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name='excerpt'
							rules={{
								required: 'Поле "Название защиты" обязательно для заполнения'
							}}
							render={({ field }) => (
								<TextField
									label='Название защиты'
									id='standard-multiline-static'
									fullWidth
									multiline
									onChange={field.onChange}
									inputRef={field.ref}
									value={field.value || ''}
									error={!!errors.excerpt?.message}
									helperText={errors.excerpt?.message}
									sx={{ mt: 2 }}
								/>
							)}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name='protectionName'
							rules={{
								required: 'Поле "Выдержка" обязательно для заполнения'
							}}
							render={({ field }) => (
								<TextField
									label='Выдержка'
									fullWidth
									multiline
									onChange={field.onChange}
									inputRef={field.ref}
									value={field.value || ''}
									error={!!errors.protectionName?.message}
									helperText={errors.protectionName?.message}
									sx={{ mt: 2 }}
								/>
							)}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name='source'
							rules={{
								required: 'Поле "Источник" обязательно для заполнения'
							}}
							render={({ field }) => (
								<TextField
									label='Источник'
									fullWidth
									multiline
									onChange={field.onChange}
									inputRef={field.ref}
									value={field.value || ''}
									error={!!errors.source?.message}
									helperText={errors.source?.message}
								/>
							)}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name='triggeringAlgorithm'
							rules={{
								required:
									'Поле "Условие срабатывания" обязательно для заполнения'
							}}
							render={({ field }) => (
								<TextField
									label='Условие срабатывания'
									fullWidth
									multiline
									onChange={field.onChange}
									inputRef={field.ref}
									value={field.value || ''}
									error={!!errors.triggeringAlgorithm?.message}
									helperText={errors.triggeringAlgorithm?.message}
								/>
							)}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name='triggeringConditions'
							rules={{
								required:
									'Поле "Алгоритм срабатывания" обязательно для заполнения'
							}}
							render={({ field }) => (
								<TextField
									id='standard-multiline-static'
									label='Алгоритм срабатывания'
									rows={16}
									fullWidth
									multiline
									onChange={field.onChange}
									inputRef={field.ref}
									value={field.value || ''}
									error={!!errors.triggeringConditions?.message}
									helperText={errors.triggeringConditions?.message}
									sx={{ width: '552px' }}
								/>
							)}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					variant='contained'
					onClick={handleSubmit(onSubmit)}
				>
					<SaveIcon />
					Сохранить
				</Button>
			</DialogActions>
		</Dialog>
	)
}
