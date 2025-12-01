import { createTheme } from '@mui/material/styles'

import { BUTTON_STYLES, COLORS } from './tokens'

export const appTheme = createTheme({
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: BUTTON_STYLES.borderRadius,
					textTransform: 'none',
					fontWeight: 600,
					transition: BUTTON_STYLES.effects.transition,
					'&:active': {
						transform: 'scale(0.98)'
					}
				},
				contained: {
					background: BUTTON_STYLES.glass.light.background,
					backdropFilter: BUTTON_STYLES.effects.blur,
					boxShadow: BUTTON_STYLES.effects.shadow,
					color: BUTTON_STYLES.glass.light.text,
					'&:hover': {
						background: BUTTON_STYLES.glass.light.hover,
						color: BUTTON_STYLES.glass.light.textHover,
						boxShadow: BUTTON_STYLES.effects.shadow
					},
					'&:disabled': {
						background: 'rgba(0, 0, 0, 0.05)',
						color: 'rgba(0, 0, 0, 0.3)',
						backdropFilter: 'none'
					}
				},
				outlined: {
					border: '1px solid rgba(0, 115, 230, 0.3)',
					background: 'rgba(255, 255, 255, 0.5)',
					backdropFilter: BUTTON_STYLES.effects.blur,
					color: COLORS.primary,
					'&:hover': {
						background: 'rgba(0, 115, 230, 0.1)',
						borderColor: COLORS.primary,
						boxShadow: BUTTON_STYLES.effects.shadow
					},
					'&:disabled': {
						background: 'rgba(0, 0, 0, 0.02)',
						borderColor: 'rgba(0, 0, 0, 0.1)',
						color: 'rgba(0, 0, 0, 0.3)',
						backdropFilter: 'none'
					}
				},
				text: {
					color: COLORS.primary,
					'&:hover': {
						background: 'rgba(0, 115, 230, 0.08)'
					}
				}
			},
			variants: [
				{
					props: { variant: 'contained', color: 'error' },
					style: {
						background: BUTTON_STYLES.glass.danger.background,
						color: BUTTON_STYLES.glass.danger.text,
						backdropFilter: BUTTON_STYLES.effects.blur,
						boxShadow: BUTTON_STYLES.effects.shadowDanger,
						'&:hover': {
							background: BUTTON_STYLES.glass.danger.hover,
							color: BUTTON_STYLES.glass.danger.textHover,
							boxShadow: BUTTON_STYLES.effects.shadowDanger
						},
						'&:disabled': {
							background: 'rgba(211, 47, 47, 0.08)',
							color: 'rgba(255, 255, 255, 0.5)',
							backdropFilter: 'none'
						}
					}
				}
			]
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					borderRadius: BUTTON_STYLES.borderRadius,
					transition: BUTTON_STYLES.effects.transition,
					'&:active': {
						transform: 'scale(0.98)'
					}
				}
			}
		}
	}
})
