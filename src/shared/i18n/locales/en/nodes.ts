export default {
	tableTitle: 'Table of protection settings of the technological object',
	actions: {
		saveToExcel: 'Save to Excel'
	},
	confirmations: {
		deleteObject: 'Are you sure you want to delete object {{name}}?',
		deleteRow: 'Are you sure you want to delete this row?'
	},
	labels: {
		withoutName: 'without name',
		nameNotSet: 'Name not set',
		settings: 'Settings',
		nodeName: 'Name',
		lock: 'Lock',
		unlock: 'Unlock',
		lockNode: 'Lock movement',
		visualSettings: 'Object status',
		status: 'Object status',
		copyNode: 'Copy object',
		copyNodes: 'Copy objects',
		pasteNodes: 'Paste objects'
	},
	hints: {
		lockNode: 'Locked object cannot be moved',
		saveChanges: 'Change the name and click "Save"',
		statusHint:
			'Select object status. The object color will change automatically'
	},
	status: {
		normal: 'Operating normally',
		warning: 'Warning',
		error: 'Emergency state',
		info: 'Technical maintenance'
	},
	messages: {
		addSuccess: 'Object added successfully.',
		addError: 'Error adding node.',
		addDataError: 'Error adding data.',
		updateError: 'Error updating node.',
		updateDataError: 'Error updating data.',
		deleteError: 'Error deleting',
		deleteNodeError: 'Error deleting node.',
		deleteRowError: 'Error deleting row.',
		deleteRowSuccess: 'Row deleted successfully.',
		createEdgeSuccess: 'Edge created successfully',
		createEdgeError: 'Error creating edge',
		deleteEdgeSuccess: 'Edge deleted',
		deleteEdgeError: 'Error deleting edge',
		nodeCopied: 'Object copied',
		nodesCopied: 'Objects copied',
		nodesPasted: 'Objects pasted',
		clipboardEmpty: 'Clipboard is empty',
		copyError: 'Error copying',
		pasteError: 'Error pasting'
	},
	placeholders: {
		nodeName: 'Enter node name',
		riverName: 'Enter river name',
		name: 'Name'
	},
	dialogs: {
		deleteConfirm: 'Are you sure you want to delete object',
		deleteRowTitle: 'Confirm deletion'
	},
	fields: {
		protectionName: 'Protection name',
		excerpt: 'Excerpt',
		source: 'Source',
		triggeringConditions: 'Triggering conditions',
		triggeringAlgorithm: 'Triggering algorithm'
	},
	excel: {
		protectionName: 'Protection name',
		excerpt: 'Time delay',
		source: 'Source',
		triggeringConditions: 'Triggering conditions',
		triggeringAlgorithm: 'Triggering algorithm',
		fileName: 'Protection Settings.xlsx'
	},
	dataGrid: {
		labelRowsPerPage: 'Rows per page',
		labelDisplayedRows: '{{from}}–{{to}} of {{count}}',
		footerRowSelected: '{{count}} row(s) selected',
		columnMenuSortAsc: 'Sort by ASC',
		columnMenuSortDesc: 'Sort by DESC',
		columnMenuUnsort: 'Unsort',
		filterPanelAddFilter: 'Add filter',
		filterPanelOperators: 'Operators',
		filterPanelOperatorAnd: 'And',
		filterPanelOperatorOr: 'Or',
		filterPanelColumns: 'Columns',
		filterPanelInputLabel: 'Value',
		filterPanelInputPlaceholder: 'Filter value',
		columnMenuLabel: 'Menu',
		columnMenuShowColumns: 'Column management',
		columnMenuFilter: 'Filter',
		columnMenuHideColumn: 'Hide',
		columnsManagementSearchTitle: 'Search column',
		columnsManagementShowHideAllText: 'Show/Hide All',
		columnsManagementReset: 'Reset',
		noRowsLabel: 'No rows',
		noResultsOverlayLabel: 'No results found.',
		errorOverlayDefaultLabel: 'An error occurred.',
		columnHeaderFiltersTooltipActive: '{{count}} filter(s) active',
		columnHeaderFiltersLabel: 'Show filters',
		columnHeaderSortIconLabel: 'Sort'
	}
} as const
