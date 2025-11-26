import { getStatusColors } from './constants'
import type { VisualState } from './types'

export const getConicGradient = (visualState?: VisualState): string => {
	const colors = getStatusColors(visualState?.status)
	return `conic-gradient(
		${colors.dark} 0deg 90deg,
		${colors.light} 90deg 180deg,
		${colors.dark} 180deg 270deg,
		${colors.light} 270deg 360deg
	)`
}

export const getVisualStyles = (
	visualState?: VisualState
): {
	background?: string
	borderColor?: string
	borderWidth?: string
	opacity?: number
} => {
	const colors = getStatusColors(visualState?.status)

	return {
		background: getConicGradient(visualState),
		borderColor: colors.border,
		borderWidth: '1px',
		opacity: 1
	}
}

export const getCylinderBackground = (visualState?: VisualState): string => {
	const colors = getStatusColors(visualState?.status)
	return colors.light
}

export const normalizeStatus = (status?: VisualState['status']): string => {
	return status || 'normal'
}
