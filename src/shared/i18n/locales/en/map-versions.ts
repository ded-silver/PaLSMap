export default {
	labels: {
		saveVersion: 'Save Version',
		currentVersion: 'Current Version',
		versions: 'Map Versions',
		viewVersion: 'View',
		view: 'View',
		restoreVersion: 'Restore',
		deleteVersion: 'Delete',
		versionName: 'Version Name',
		versionDescription: 'Description',
		version: 'Version',
		createdBy: 'Created By',
		nodeCount: 'Nodes',
		versionTitle: 'Map Versions',
		backToMap: 'Back to Map',
		restoreThisVersion: 'Restore This Version',
		viewingVersion: 'Viewing Version',
		exportPdf: 'Export PDF',
		selectVersion: 'Select Version'
	},
	messages: {
		versionSaved: 'Version saved successfully',
		versionRestored: 'Version restored successfully',
		versionDeleted: 'Version deleted',
		loadingVersions: 'Loading versions...',
		noVersions: 'No versions found',
		versionLoadError: 'Error loading version',
		versionsLoadError: 'Error loading versions',
		restoreError: 'Error restoring version',
		deleteError: 'Error deleting version',
		saveError: 'Error saving version',
		versionNotFound: 'Version not found',
		pdfExportInDevelopment: 'PDF export is under development',
		error: 'An error occurred',
		unknownUser: 'Unknown user',
		areaIdRequired: 'Area ID is required',
		restoring: 'Restoring...',
		deleting: 'Deleting...'
	},
	confirmations: {
		restoreVersion:
			"Restore map to version '{{name}}'? Current changes will be lost.",
		deleteVersion: 'Delete version'
	},
	placeholders: {
		versionName: 'Version 1.1 2025',
		versionDescription: 'Optional description of the version'
	},
	errors: {
		versionNameRequired: 'Version name is required',
		versionNameMinLength: 'Version name must be at least 1 character',
		versionNotFound: 'Version not found',
		loadError: 'Error loading version data'
	},
	info: {
		versionCreated: 'Created {{date}}',
		createdByUser: 'by {{user}}',
		nodesCount: '{{count}} nodes',
		nodeCount: '{{count}} nodes',
		viewingVersionMode: 'Viewing version: {{name}}',
		readOnlyMode: 'Read-only mode',
		totalVersions: 'Total versions: {{count}}'
	},
	time: {
		justNow: 'just now',
		minutesAgo: '{{count}} min. ago',
		hoursAgo: '{{count}} hr. ago',
		daysAgo: '{{count}} days ago',
		weeksAgo: '{{count}} weeks ago',
		monthsAgo: '{{count}} months ago',
		yearsAgo: '{{count}} years ago'
	}
} as const
