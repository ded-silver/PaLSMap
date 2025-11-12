export default {
	buttons: {
		save: 'Save',
		cancel: 'Cancel',
		delete: 'Delete',
		edit: 'Edit',
		add: 'Add',
		close: 'Close',
		confirm: 'Confirm',
		logout: 'Logout',
		login: 'Login',
		register: 'Register'
	},
	titles: {
		main: 'GEOGRAPHICAL SCHEME OF TECHNOLOGICAL OBJECTS',
		dictionary: 'REFERENCE INFORMATION',
		profile: 'Profile'
	},
	sidebar: {
		home: 'Home',
		dictionary: 'Reference Information'
	},
	messages: {
		loading: 'Loading...',
		saving: 'Saving...',
		deleting: 'Deleting...',
		noResults: 'No results found',
		error: 'Error',
		success: 'Success'
	},
	confirmations: {
		delete: 'Are you sure you want to delete {{item}}?',
		deleteObject: 'Are you sure you want to delete object {{name}}?',
		deleteRow: 'Are you sure you want to delete this row?'
	},
	labels: {
		email: 'Email',
		password: 'Password',
		name: 'Full Name',
		fullName: 'Surname First Name',
		abbreviation: 'Abbreviation',
		fullNameLabel: 'Full name'
	},
	placeholders: {
		search: 'Search...',
		searchAbbreviations: 'Search abbreviations...',
		email: 'example@mail.com',
		password: '••••••••',
		fullName: 'Surname First Name'
	},
	errors: {
		required: 'Field is required',
		email: 'Email is required',
		password: 'Password is required',
		minLength: 'Minimum {{count}} characters',
		loadError: 'Error loading data. Please refresh the page.',
		profileUpdateError: 'Error updating profile'
	},
	profile: {
		requestRights: 'Request rights',
		requestRightsSuccess: 'Your request for rights upgrade has been sent',
		saveSuccess: 'Changes saved'
	}
} as const
