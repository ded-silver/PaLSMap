export default {
	labels: {
		countries: 'Countries',
		pathAreas: 'Path Areas',
		country: 'Country',
		pathArea: 'Path Area',
		createCountry: 'Create Country',
		createPathArea: 'Create Path Area',
		openMap: 'Open Map',
		noCountries: 'No countries',
		noPathAreas: 'No path areas',
		name: 'Name',
		code: 'Code'
	},
	actions: {
		create: 'Create',
		back: 'Back'
	},
	validation: {
		nameRequired: 'Name is required',
		nameMinLength: 'Name must contain at least 1 character',
		countryRequired: 'Country is required'
	},
	messages: {
		deleteTitle: 'Confirm deletion',
		deleteConfirm: 'Are you sure you want to delete this record?',
		createSuccess: 'Record created successfully',
		updateSuccess: 'Record updated successfully',
		deleteSuccess: 'Record deleted successfully',
		createError: 'Error creating record',
		updateError: 'Error updating record',
		deleteError: 'Error deleting record',
		duplicateError: 'Record with this name already exists',
		forbiddenError: 'Insufficient permissions to perform operation',
		unauthorizedError: 'Authorization required',
		notFoundError: 'Record not found'
	},
	errors: {
		invalidCountry: 'Invalid country identifier',
		loadError: 'Error loading data'
	}
} as const
