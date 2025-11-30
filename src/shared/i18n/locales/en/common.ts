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
		dictionary: 'Reference Information',
		profile: 'Profile'
	},
	sidebar: {
		home: 'Home',
		dictionary: 'Reference Information',
		users: 'User Management',
		history: 'Change History'
	},
	messages: {
		loading: 'Loading...',
		saving: 'Saving...',
		deleting: 'Deleting...',
		uploading: 'Uploading...',
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
		title: 'Profile',
		edit: 'Edit Profile',
		saveSuccess: 'Changes saved',
		passwordChangedSuccess: 'Password changed successfully',
		requestRights: 'Request rights',
		requestRightsSuccess: 'Your request for rights upgrade has been sent',
		emailCopied: 'Email copied to clipboard',
		position: 'Position',
		role: {
			label: 'Role',
			admin: 'Administrator',
			user: 'User',
			superAdmin: 'Super Administrator'
		},
		registered: 'Registered',
		updated: 'Updated',
		dates: {
			created: 'Registration Date',
			updated: 'Update Date'
		},
		avatar: {
			url: 'Avatar URL',
			urlHint: 'Or paste an image link',
			change: 'Change Avatar',
			uploadFromDevice: 'Upload from device',
			uploadSuccess: 'Avatar uploaded successfully',
			uploadError: 'Error uploading avatar',
			invalidFileType: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP',
			fileTooLarge: 'File is too large. Maximum size: 5MB'
		},
		security: {
			title: 'Security Settings',
			currentPassword: 'Current Password',
			newPassword: 'New Password',
			confirmPassword: 'Confirm Password',
			changePassword: 'Change Password'
		},
		actions: {
			title: 'Actions',
			logout: 'Logout',
			logoutConfirmTitle: 'Confirm Logout',
			logoutConfirmMessage: 'Are you sure you want to logout?'
		}
	},
	compass: {
		north: 'N',
		south: 'S',
		west: 'W',
		east: 'E'
	},
	dndSidebar: {
		collapse: 'Collapse',
		expand: 'Expand'
	}
} as const
