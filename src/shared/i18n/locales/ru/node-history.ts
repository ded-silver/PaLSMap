export default {
	labels: {
		history: 'История изменений',
		entityType: 'Тип объекта',
		actionType: 'Тип действия',
		user: 'Пользователь',
		dateFrom: 'Дата от',
		dateTo: 'Дата до',
		nodeId: 'ID объекта',
		details: 'Детали',
		before: 'До',
		after: 'После',
		changed: 'Изменено',
		created: 'Создано',
		deleted: 'Удалено',
		changeTime: 'Время изменения',
		description: 'Описание',
		changes: 'Изменения',
		recentChanges: 'Последние изменения объекта',
		entityId: 'ID'
	},
	messages: {
		noHistory: 'История изменений пуста',
		loading: 'Загрузка истории...',
		error: 'Ошибка при загрузке истории',
		noChanges: 'Нет изменений для отображения',
		unknownUser: 'Неизвестный пользователь',
		noResults: 'По выбранным фильтрам ничего не найдено'
	},
	info: {
		showingResults: 'Показано {{from}}–{{to}} из {{total}}',
		copyId: 'Скопировать ID',
		idCopied: 'ID скопирован'
	},
	actions: {
		showAll: 'Показать всю историю',
		resetFilters: 'Сбросить фильтры'
	},
	entityTypes: {
		NODE: 'Объект',
		EDGE: 'Связь',
		TABLE_DATA: 'Данные таблицы',
		ALL: 'Все'
	},
	actionTypes: {
		CREATE: 'Создание',
		UPDATE: 'Обновление',
		DELETE: 'Удаление',
		MOVE: 'Перемещение',
		LOCK: 'Блокировка',
		UNLOCK: 'Разблокировка',
		VISUAL_STATE_CHANGE: 'Изменение визуальных настроек',
		PARENT_CHANGE: 'Изменение родителя',
		LABEL_CHANGE: 'Изменение названия',
		TYPE_CHANGE: 'Изменение типа',
		HANDLERS_CHANGE: 'Изменение связи',
		ALL: 'Все'
	},
	placeholders: {
		selectEntityType: 'Выберите тип объекта',
		selectActionType: 'Выберите тип действия',
		selectUser: 'Выберите пользователя',
		enterNodeId: 'Введите ID объекта'
	},
	time: {
		justNow: 'Только что',
		minutesAgo: '{{count}} минут назад',
		hoursAgo: '{{count}} часов назад',
		daysAgo: '{{count}} дней назад',
		weeksAgo: '{{count}} недель назад',
		monthsAgo: '{{count}} месяцев назад',
		yearsAgo: '{{count}} лет назад'
	}
} as const
