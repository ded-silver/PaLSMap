import type { GridLocaleText } from '@mui/x-data-grid'
import { enUS, ruRU } from '@mui/x-data-grid/locales'
import { useTranslation } from 'react-i18next'

export const useDataGridLocaleText = (): Partial<GridLocaleText> => {
	const { t, i18n } = useTranslation('nodes')
	const currentLanguage = i18n.language

	const baseLocaleText =
		currentLanguage === 'ru'
			? ruRU.components.MuiDataGrid.defaultProps.localeText
			: enUS.components.MuiDataGrid.defaultProps.localeText

	const customLocaleText: any = {
		footerRowSelected: (count: number) => {
			return t('dataGrid.footerRowSelected', { count })
		},
		columnMenuSortAsc: t('dataGrid.columnMenuSortAsc'),
		columnMenuSortDesc: t('dataGrid.columnMenuSortDesc'),
		columnMenuUnsort: t('dataGrid.columnMenuUnsort'),
		filterPanelAddFilter: t('dataGrid.filterPanelAddFilter'),
		filterPanelDeleteIconLabel: t('dataGrid.filterPanelDeleteIconLabel'),
		filterPanelOperators: t('dataGrid.filterPanelOperators'),
		filterPanelOperatorAnd: t('dataGrid.filterPanelOperatorAnd'),
		filterPanelOperatorOr: t('dataGrid.filterPanelOperatorOr'),
		filterPanelColumns: t('dataGrid.filterPanelColumns'),
		filterPanelInputLabel: t('dataGrid.filterPanelInputLabel'),
		filterPanelInputPlaceholder: t('dataGrid.filterPanelInputPlaceholder'),
		columnMenuLabel: t('dataGrid.columnMenuLabel'),
		columnMenuShowColumns: t('dataGrid.columnMenuShowColumns'),
		columnMenuFilter: t('dataGrid.columnMenuFilter'),
		columnMenuHideColumn: t('dataGrid.columnMenuHideColumn'),
		columnsManagementSearchTitle: t('dataGrid.columnsManagementSearchTitle'),
		columnsManagementShowHideAllText: t(
			'dataGrid.columnsManagementShowHideAllText'
		),
		columnsManagementReset: t('dataGrid.columnsManagementReset'),
		noRowsLabel: t('dataGrid.noRowsLabel'),
		noResultsOverlayLabel: t('dataGrid.noResultsOverlayLabel'),
		errorOverlayDefaultLabel: t('dataGrid.errorOverlayDefaultLabel'),
		loadingOverlayLabel: t('dataGrid.loadingOverlayLabel'),
		columnHeaderFiltersTooltipActive: (count: number) => {
			return t('dataGrid.columnHeaderFiltersTooltipActive', { count })
		},
		columnHeaderFiltersLabel: t('dataGrid.columnHeaderFiltersLabel'),
		columnHeaderSortIconLabel: t('dataGrid.columnHeaderSortIconLabel')
	}

	return {
		...baseLocaleText,
		...customLocaleText
	} as Partial<GridLocaleText>
}
