import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type {
	ActionType,
	EntityType,
	HistoryFiltersParams
} from '../../model/types'

import styles from './HistoryFilters.module.css'
import { useAllUsers } from '@/entities/user'

interface HistoryFiltersProps {
	filters: HistoryFiltersParams
	onFiltersChange: (filters: HistoryFiltersParams) => void
	onReset: () => void
}

const ENTITY_TYPES: (EntityType | 'ALL')[] = [
	'ALL',
	'NODE',
	'EDGE',
	'TABLE_DATA'
]

const ACTION_TYPES: (ActionType | 'ALL')[] = [
	'ALL',
	'CREATE',
	'UPDATE',
	'DELETE',
	'MOVE',
	'LOCK',
	'UNLOCK',
	'VISUAL_STATE_CHANGE',
	'PARENT_CHANGE',
	'HANDLERS_CHANGE',
	'LABEL_CHANGE',
	'TYPE_CHANGE'
]

const formatDateForInput = (dateString?: string): string => {
	if (!dateString) return ''
	return dateString.split('T')[0]
}

const formatDateForApi = (date: string, isEndOfDay = false): string => {
	if (!date) return ''
	return isEndOfDay ? `${date}T23:59:59Z` : `${date}T00:00:00Z`
}

export const HistoryFilters = ({
	filters,
	onFiltersChange,
	onReset
}: HistoryFiltersProps) => {
	const { t } = useTranslation('node-history')
	const { data: users } = useAllUsers()
	const [nodeIdValue, setNodeIdValue] = useState(filters.nodeId || '')

	const handleEntityTypeChange = useCallback(
		(value: string) => {
			onFiltersChange({
				...filters,
				entityType: value === 'ALL' ? undefined : (value as EntityType)
			})
		},
		[filters, onFiltersChange]
	)

	const handleActionTypeChange = useCallback(
		(value: string) => {
			onFiltersChange({
				...filters,
				actionType: value === 'ALL' ? undefined : (value as ActionType)
			})
		},
		[filters, onFiltersChange]
	)

	const handleUserIdChange = useCallback(
		(value: string) => {
			onFiltersChange({
				...filters,
				userId: value === '' ? undefined : value
			})
		},
		[filters, onFiltersChange]
	)

	const handleDateFromChange = useCallback(
		(value: string) => {
			onFiltersChange({
				...filters,
				dateFrom: value ? formatDateForApi(value) : undefined
			})
		},
		[filters, onFiltersChange]
	)

	const handleDateToChange = useCallback(
		(value: string) => {
			onFiltersChange({
				...filters,
				dateTo: value ? formatDateForApi(value, true) : undefined
			})
		},
		[filters, onFiltersChange]
	)

	useEffect(() => {
		setNodeIdValue(filters.nodeId || '')
	}, [filters.nodeId])

	const handleNodeIdChange = (value: string) => {
		setNodeIdValue(value)
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			if (nodeIdValue !== (filters.nodeId || '')) {
				onFiltersChange({
					...filters,
					nodeId: nodeIdValue || undefined
				})
			}
		}, 500)

		return () => clearTimeout(timer)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nodeIdValue])

	return (
		<Box className={styles.container}>
			<Box className={styles.filters}>
				<FormControl
					size='small'
					className={styles.filter}
				>
					<InputLabel>{t('labels.entityType')}</InputLabel>
					<Select
						value={filters.entityType || 'ALL'}
						label={t('labels.entityType')}
						onChange={e => handleEntityTypeChange(e.target.value)}
					>
						{ENTITY_TYPES.map(type => (
							<MenuItem
								key={type}
								value={type}
							>
								{t(`entityTypes.${type}`)}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl
					size='small'
					className={styles.filter}
				>
					<InputLabel>{t('labels.actionType')}</InputLabel>
					<Select
						value={filters.actionType || 'ALL'}
						label={t('labels.actionType')}
						onChange={e => handleActionTypeChange(e.target.value)}
					>
						{ACTION_TYPES.map(type => (
							<MenuItem
								key={type}
								value={type}
							>
								{t(`actionTypes.${type}`)}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl
					size='small'
					className={styles.filter}
				>
					<InputLabel>{t('labels.user')}</InputLabel>
					<Select
						value={filters.userId || ''}
						label={t('labels.user')}
						onChange={e => handleUserIdChange(e.target.value)}
					>
						<MenuItem value=''>
							<em>{t('entityTypes.ALL')}</em>
						</MenuItem>
						{users?.map(user => (
							<MenuItem
								key={user.id}
								value={user.id}
							>
								{user.name || user.email}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					size='small'
					type='date'
					label={t('labels.dateFrom')}
					value={formatDateForInput(filters.dateFrom)}
					onChange={e => handleDateFromChange(e.target.value)}
					InputLabelProps={{
						shrink: true
					}}
					className={styles.filter}
				/>

				<TextField
					size='small'
					type='date'
					label={t('labels.dateTo')}
					value={formatDateForInput(filters.dateTo)}
					onChange={e => handleDateToChange(e.target.value)}
					InputLabelProps={{
						shrink: true
					}}
					className={styles.filter}
				/>

				<TextField
					size='small'
					label={t('labels.nodeId')}
					value={nodeIdValue}
					onChange={e => handleNodeIdChange(e.target.value)}
					placeholder={t('placeholders.enterNodeId')}
					className={styles.filter}
				/>
			</Box>

			<Box className={styles.actions}>
				<Button
					variant='outlined'
					onClick={onReset}
					size='small'
				>
					{t('actions.resetFilters')}
				</Button>
			</Box>
		</Box>
	)
}
