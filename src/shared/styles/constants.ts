export const COLORS = {
	background: '#e6f0ff',
	backgroundLight: '#F7F9FB',
	backgroundGrid: '#E6E6E6',
	primary: '#0073e6',
	primaryDark: '#4472C4',
	white: '#FFFFFF',
	black: '#000000'
} as const

export const SIZES = {
	snapGrid: [25, 25],
	providerHeight: '400px',

	defaultPageSize: 10,
	pageSizeOptions: [5, 10, 15, 20] as const,

	textFieldLarge: '552px',

	zIndexProvider: 9999
} as const

export const EXCEL_STYLES = {
	header: {
		font: { bold: true, color: { argb: 'FFFFFFFF' } },
		fill: {
			type: 'pattern' as const,
			pattern: 'solid' as const,
			fgColor: { argb: 'FF4472C4' }
		},
		alignment: {
			horizontal: 'center' as const,
			vertical: 'middle' as const,
			wrapText: true
		},
		border: {
			top: { style: 'thin' as const },
			left: { style: 'thin' as const },
			bottom: { style: 'thin' as const },
			right: { style: 'thin' as const }
		}
	},
	cell: {
		alignment: {
			horizontal: 'left' as const,
			vertical: 'top' as const,
			wrapText: true
		},
		border: {
			top: { style: 'thin' as const },
			left: { style: 'thin' as const },
			bottom: { style: 'thin' as const },
			right: { style: 'thin' as const }
		}
	}
} as const

export const EDGE_STYLES = {
	default: {
		strokeWidth: 1,
		stroke: 'black'
	}
} as const

export const MUI_STYLES = {
	typography: {
		titleLarge: {
			fontSize: '2.125rem'
		},
		titleMedium: {
			fontSize: '1.5rem',
			fontWeight: 600
		},
		titleSmall: {
			fontSize: '1.25rem',
			fontWeight: 600
		},
		bodyBold: {
			fontWeight: 600
		}
	},
	dialogTitlePrimary: {
		backgroundColor: COLORS.primary,
		color: COLORS.white,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '16px 24px'
	},
	dialogTitleCentered: {
		backgroundColor: COLORS.primary,
		color: COLORS.white,
		textAlign: 'center',
		width: '100%'
	},
	iconButtonClose: {
		position: 'absolute' as const,
		right: 8,
		top: 8
	},
	iconButtonClosePrimary: {
		color: COLORS.white,
		'&:hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.1)'
		}
	},
	dialogContent: {
		padding: '24px'
	},
	dialogActions: {
		padding: '16px 24px'
	},
	dialogPaper: {
		borderRadius: '12px'
	},
	textWrap: {
		whiteSpace: 'pre-line',
		wordBreak: 'break-word',
		hyphens: 'auto'
	},
	selectPrimary: {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		color: COLORS.white,
		border: '1px solid rgba(255, 255, 255, 0.2)',
		'& .MuiSelect-select': {
			padding: '4px 32px 4px 8px',
			fontSize: '0.875rem',
			color: COLORS.white
		},
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor: 'rgba(255, 255, 255, 0.2)'
		},
		'&:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: 'rgba(255, 255, 255, 0.4)'
		},
		'& .MuiSvgIcon-root': {
			color: COLORS.white
		}
	},
	spacing: {
		mt2: { mt: 2 },
		mb2: { mb: 2 },
		gap1: { gap: '1rem' },
		mb1: { marginBottom: '8px' },
		mb2px: { marginBottom: '16px' }
	},
	flexColumn: {
		display: 'flex',
		flexDirection: 'column'
	},
	flexRow: {
		display: 'flex',
		flexDirection: 'row'
	},
	flexGrow: {
		flexGrow: 1
	},
	providerWrapper: {
		zIndex: SIZES.zIndexProvider,
		backgroundColor: COLORS.background
	}
} as const
