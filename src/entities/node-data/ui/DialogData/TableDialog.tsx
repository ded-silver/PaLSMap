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
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { NodeDataService } from '@/entities/node-data'
import type { NodeData, NodeDataPayload } from '@/entities/node-data'
import { MUI_STYLES, SIZES } from '@/shared/styles/constants'

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
	const { t: tNodes } = useTranslation('nodes')
	const { t: tValidation } = useTranslation('validation')
	const queryClient = useQueryClient()

	const { mutate: createNodeData } = useMutation({
		mutationKey: ['createNodeData'],
		mutationFn: (data: NodeDataPayload) => NodeDataService.createNodeData(data),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['currentNodeData'] })
		},
		onError: error => {
			toast.error(tNodes('messages.addDataError'))
		}
	})

	const { mutate: updateNodeData } = useMutation({
		mutationKey: ['updateNodeData'],
		mutationFn: (data: NodeData) => NodeDataService.updateNodeData(data),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['currentNodeData'] })
		},
		onError: error => {
			toast.error(tNodes('messages.updateDataError'))
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
				>
					<Grid
						item
						xs={12}
						md={6}
					>
						<Controller
							control={control}
							name='protectionName'
							rules={{
								required: tValidation('protectionNameRequired')
							}}
							render={({ field }) => (
								<TextField
									label={tNodes('fields.protectionName')}
									id='standard-multiline-static'
									fullWidth
									multiline
									onChange={field.onChange}
									inputRef={field.ref}
									value={field.value || ''}
									error={!!errors.protectionName?.message}
									helperText={errors.protectionName?.message}
									sx={MUI_STYLES.spacing.mt2}
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
							name='excerpt'
							rules={{
								required: tValidation('excerptRequired')
							}}
							render={({ field }) => (
								<TextField
									label={tNodes('fields.excerpt')}
									fullWidth
									multiline
									onChange={field.onChange}
									inputRef={field.ref}
									value={field.value || ''}
									error={!!errors.excerpt?.message}
									helperText={errors.excerpt?.message}
									sx={MUI_STYLES.spacing.mt2}
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
								required: tValidation('sourceRequired')
							}}
							render={({ field }) => (
								<TextField
									label={tNodes('fields.source')}
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
							name='triggeringConditions'
							rules={{
								required: tValidation('triggeringConditionsRequired')
							}}
							render={({ field }) => (
								<TextField
									label={tNodes('fields.triggeringConditions')}
									fullWidth
									multiline
									onChange={field.onChange}
									inputRef={field.ref}
									value={field.value || ''}
									error={!!errors.triggeringConditions?.message}
									helperText={errors.triggeringConditions?.message}
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
								required: tValidation('triggeringAlgorithmRequired')
							}}
							render={({ field }) => (
								<TextField
									id='standard-multiline-static'
									label={tNodes('fields.triggeringAlgorithm')}
									rows={16}
									fullWidth
									multiline
									onChange={field.onChange}
									inputRef={field.ref}
									value={field.value || ''}
									error={!!errors.triggeringAlgorithm?.message}
									helperText={errors.triggeringAlgorithm?.message}
									sx={{ width: SIZES.textFieldLarge }}
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
					{tNodes('actions.save')}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
