export default {
	title: 'Reference Information',
	buttons: {
		add: 'Add record',
		edit: 'Edit record'
	},
	fields: {
		short: 'Abbreviation',
		full: 'Full name'
	},
	validation: {
		shortRequired: 'Abbreviation is required',
		shortMinLength: 'Abbreviation must contain at least 1 character',
		fullRequired: 'Full name is required',
		fullMinLength: 'Full name must contain at least 1 character'
	},
	messages: {
		empty: 'Dictionary is empty',
		deleteConfirm: 'Are you sure you want to delete this record?',
		abbreviation: 'Abbreviation:',
		fullName: 'Full name:',
		deleteTitle: 'Confirm deletion',
		createSuccess: 'Record created successfully',
		updateSuccess: 'Record updated successfully',
		deleteSuccess: 'Record deleted successfully',
		createError: 'Error creating record',
		updateError: 'Error updating record',
		deleteError: 'Error deleting record',
		duplicateError: 'Abbreviation already exists',
		forbiddenError: 'Insufficient permissions to perform operation',
		unauthorizedError: 'Authorization required',
		notFoundError: 'Record not found'
	}
} as const
