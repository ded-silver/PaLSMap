import type { VisualState } from './types'

export const STATUS_COLORS = {
	normal: { dark: '#1d502f', light: '#9cf8bc', border: '#15803d' },
	warning: { dark: '#92400e', light: '#fde047', border: '#f59e0b' },
	error: { dark: '#991b1b', light: '#fca5a5', border: '#ef4444' },
	info: { dark: '#1e40af', light: '#93c5fd', border: '#3b82f6' }
} as const satisfies Record<
	'normal' | 'warning' | 'error' | 'info',
	{ dark: string; light: string; border: string }
>

export const getStatusColors = (
	status?: VisualState['status']
): { dark: string; light: string; border: string } => {
	const normalizedStatus = status || 'normal'
	return STATUS_COLORS[normalizedStatus] || STATUS_COLORS.normal
}

export const getStatusBorderColor = (
	status?: VisualState['status'] | string
): string => {
	const normalizedStatus = status as VisualState['status'] | undefined
	return getStatusColors(normalizedStatus).border
}
