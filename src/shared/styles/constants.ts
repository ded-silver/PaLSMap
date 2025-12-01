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
