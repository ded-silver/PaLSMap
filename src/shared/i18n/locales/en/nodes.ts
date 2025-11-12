export default {
	title: 'GEOGRAPHICAL SCHEME OF TECHNOLOGICAL OBJECTS',
	tableTitle: 'Table of protection settings of the technological object',
	actions: {
		edit: 'Edit',
		delete: 'Delete',
		save: 'Save',
		saveToExcel: 'Save to Excel',
		add: 'Add'
	},
	confirmations: {
		deleteObject: 'Are you sure you want to delete object {{name}}?',
		deleteRow: 'Are you sure you want to delete this row?'
	},
	labels: {
		withoutName: 'without name',
		nameNotSet: 'Name not set'
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
		deleteEdgeError: 'Error deleting edge'
	},
	placeholders: {
		nodeName: 'Enter node name',
		riverName: 'Enter river name',
		name: 'Name'
	},
	dialogs: {
		deleteTitle: 'Confirm deletion',
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
	}
} as const
