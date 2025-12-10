export default {
	labels: {
		saveVersion: 'Сохранить версию',
		currentVersion: 'Текущая версия',
		versions: 'Версии карты',
		viewVersion: 'Просмотреть',
		view: 'Просмотреть',
		restoreVersion: 'Восстановить',
		versionName: 'Название версии',
		versionDescription: 'Описание',
		version: 'Версия',
		createdBy: 'Создано',
		nodeCount: 'Нод',
		versionTitle: 'Версии карты',
		backToMap: 'Назад к карте',
		restoreThisVersion: 'Восстановить эту версию',
		viewingVersion: 'Просмотр версии',
		exportPdf: 'Экспорт PDF',
		selectVersion: 'Выбрать версию'
	},
	messages: {
		versionSaved: 'Версия успешно сохранена',
		versionRestored: 'Версия успешно восстановлена',
		versionDeleted: 'Версия удалена',
		loadingVersions: 'Загрузка версий...',
		noVersions: 'Версии не найдены',
		versionLoadError: 'Ошибка при загрузке версии',
		versionsLoadError: 'Ошибка при загрузке версий',
		restoreError: 'Ошибка при восстановлении версии',
		deleteError: 'Ошибка при удалении версии',
		saveError: 'Ошибка при сохранении версии',
		versionNotFound: 'Версия не найдена',
		pdfExportInDevelopment: 'Экспорт PDF в разработке',
		error: 'Произошла ошибка',
		unknownUser: 'Неизвестный пользователь',
		areaIdRequired: 'Требуется идентификатор области',
		restoring: 'Восстановление...',
		deleting: 'Удаление...'
	},
	confirmations: {
		restoreVersion:
			"Восстановить карту к версии '{{name}}'? Текущие изменения будут потеряны."
	},
	placeholders: {
		versionName: 'Версия 1.1 2025',
		versionDescription: 'Опциональное описание версии'
	},
	errors: {
		versionNameRequired: 'Название версии обязательно',
		versionNameMinLength: 'Название версии должно содержать минимум 1 символ',
		versionNotFound: 'Версия не найдена',
		loadError: 'Ошибка при загрузке данных версии'
	},
	info: {
		versionCreated: 'Создано {{date}}',
		createdByUser: 'пользователем {{user}}',
		nodesCount: '{{count}} нод',
		nodeCount: '{{count}} нод',
		viewingVersionMode: 'Просмотр версии: {{name}}',
		readOnlyMode: 'Режим просмотра',
		totalVersions: 'Всего версий: {{count}}'
	}
} as const
