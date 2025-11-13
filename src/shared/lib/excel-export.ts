import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

import { EXCEL_STYLES } from '@/shared/styles/constants'

interface ExcelColumn {
	header: string
	key: string
	width: number
}

interface ExcelExportOptions {
	columns: ExcelColumn[]
	data: Record<string, any>[]
	filename: string
	sheetName?: string
}

export const exportToExcel = async (options: ExcelExportOptions) => {
	const { columns, data, filename, sheetName = 'Sheet1' } = options

	const workbook = new ExcelJS.Workbook()
	const worksheet = workbook.addWorksheet(sheetName)

	worksheet.columns = columns

	data.forEach(item => {
		const row: Record<string, any> = {}
		columns.forEach(col => {
			row[col.key] = item[col.key]
		})
		worksheet.addRow(row)
	})

	const headerRow = worksheet.getRow(1)
	headerRow.eachCell(cell => {
		cell.font = EXCEL_STYLES.header.font
		cell.fill = EXCEL_STYLES.header.fill
		cell.alignment = EXCEL_STYLES.header.alignment
		cell.border = EXCEL_STYLES.header.border
	})

	worksheet.eachRow((row, rowNumber) => {
		if (rowNumber !== 1) {
			row.eachCell(cell => {
				cell.alignment = EXCEL_STYLES.cell.alignment
				cell.border = EXCEL_STYLES.cell.border
			})
		}
	})

	const buffer = await workbook.xlsx.writeBuffer()
	const blob = new Blob([buffer], {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	})

	saveAs(blob, filename)
}
