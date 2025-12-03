export default {
	labels: {
		history: 'Change History',
		entityType: 'Entity Type',
		actionType: 'Action Type',
		user: 'User',
		dateFrom: 'Date From',
		dateTo: 'Date To',
		nodeId: 'Object ID',
		details: 'Details',
		before: 'Before',
		after: 'After',
		changed: 'Changed',
		created: 'Created',
		deleted: 'Deleted',
		changeTime: 'Change Time',
		description: 'Description',
		changes: 'Changes',
		recentChanges: 'Recent Object Changes',
		entityId: 'ID'
	},
	messages: {
		noHistory: 'No change history',
		loading: 'Loading history...',
		error: 'Error loading history',
		noChanges: 'No changes to display',
		unknownUser: 'Unknown User',
		noResults: 'No results found for selected filters'
	},
	info: {
		showingResults: 'Showing {{from}}–{{to}} of {{total}}',
		totalResults: 'Total records: {{total}}',
		copyId: 'Copy ID',
		idCopied: 'ID copied'
	},
	actions: {
		showAll: 'Show All History',
		resetFilters: 'Reset Filters'
	},
	entityTypes: {
		NODE: 'Object',
		EDGE: 'Edge',
		TABLE_DATA: 'Table Data',
		ALL: 'All'
	},
	actionTypes: {
		CREATE: 'Create',
		UPDATE: 'Update',
		DELETE: 'Delete',
		MOVE: 'Move',
		LOCK: 'Lock',
		UNLOCK: 'Unlock',
		VISUAL_STATE_CHANGE: 'Visual State Change',
		PARENT_CHANGE: 'Parent Change',
		LABEL_CHANGE: 'Label Change',
		TYPE_CHANGE: 'Type Change',
		HANDLERS_CHANGE: 'Connection Change',
		ALL: 'All'
	},
	placeholders: {
		selectEntityType: 'Select entity type',
		selectActionType: 'Select action type',
		selectUser: 'Select user',
		enterNodeId: 'Enter object ID'
	},
	time: {
		justNow: 'Just now',
		minutesAgo: '{{count}} minutes ago',
		hoursAgo: '{{count}} hours ago',
		daysAgo: '{{count}} days ago',
		weeksAgo: '{{count}} weeks ago',
		monthsAgo: '{{count}} months ago',
		yearsAgo: '{{count}} years ago'
	}
} as const
