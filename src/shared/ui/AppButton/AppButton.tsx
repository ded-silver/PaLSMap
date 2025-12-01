import {
	CircularProgress,
	Button as MUIButton,
	ButtonProps as MUIButtonProps
} from '@mui/material'

import { BUTTON_STYLES } from '@/shared/styles/tokens'

type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type AppButtonSize = 'sm' | 'md' | 'lg'

interface AppButtonProps extends Omit<MUIButtonProps, 'variant' | 'size'> {
	variant?: AppButtonVariant
	size?: AppButtonSize
	loading?: boolean
}

const variantMap: Record<AppButtonVariant, MUIButtonProps['variant']> = {
	primary: 'contained',
	secondary: 'outlined',
	ghost: 'text',
	danger: 'contained'
}

const sizeMap: Record<AppButtonSize, { height: number; padding: string }> = {
	sm: { height: BUTTON_STYLES.heights.sm, padding: '6px 16px' },
	md: { height: BUTTON_STYLES.heights.md, padding: '8px 24px' },
	lg: { height: BUTTON_STYLES.heights.lg, padding: '12px 32px' }
}

export const AppButton = ({
	variant = 'primary',
	size = 'md',
	loading = false,
	disabled,
	children,
	startIcon,
	sx,
	...props
}: AppButtonProps) => {
	const muiVariant = variantMap[variant]
	const sizeStyles = sizeMap[size]
	const isDanger = variant === 'danger'

	return (
		<MUIButton
			variant={muiVariant}
			color={isDanger ? 'error' : 'primary'}
			disabled={disabled || loading}
			startIcon={loading ? <CircularProgress size={16} /> : startIcon}
			sx={{
				height: sizeStyles.height,
				padding: sizeStyles.padding,
				...sx
			}}
			{...props}
		>
			{children}
		</MUIButton>
	)
}
