export default {
	tableTitle: 'Таблица уставок защит технологического объекта',
	actions: {
		saveToExcel: 'Сохранить в Excel'
	},
	confirmations: {
		deleteObject: 'Вы уверены, что хотите удалить объект {{name}}?',
		deleteRow: 'Вы уверены, что хотите удалить эту строку?'
	},
	labels: {
		withoutName: 'без имени',
		nameNotSet: 'Имя не задано',
		settings: 'Настройки',
		nodeName: 'Название',
		lock: 'Заблокировать',
		unlock: 'Разблокировать',
		lockNode: 'Заблокировать перемещение',
		visualSettings: 'Состояние объекта',
		status: 'Состояние объекта',
		copyNode: 'Копировать объект',
		copyNodes: 'Копировать объекты',
		pasteNodes: 'Вставить объекты'
	},
	hints: {
		lockNode: 'Заблокированный объект не может быть перемещен',
		saveChanges: 'Измените название и нажмите «Сохранить»',
		statusHint:
			'Выберите состояние объекта. Цвет объекта изменится автоматически'
	},
	status: {
		normal: 'Работает в штатном режиме',
		warning: 'Предупреждение',
		error: 'Аварийное состояние',
		info: 'Техническое обслуживание'
	},
	messages: {
		addSuccess: 'Объект успешно добавлен.',
		addError: 'Ошибка добавления узла.',
		addDataError: 'Ошибка при добавлении данных.',
		updateError: 'Ошибка при обновлении узла.',
		updateDataError: 'Ошибка при обновлении данных.',
		deleteError: 'Ошибка при удалении',
		deleteNodeError: 'Ошибка при удалении узла.',
		deleteRowError: 'Ошибка при удалении строки.',
		deleteRowSuccess: 'Строка успешно удалена.',
		createEdgeSuccess: 'Связь успешно создана',
		createEdgeError: 'Ошибка при создании связи',
		deleteEdgeSuccess: 'Связь удалена',
		deleteEdgeError: 'Ошибка при удалении связи',
		nodeCopied: 'Объект скопирован',
		nodesCopied: 'Объекты скопированы',
		nodesPasted: 'Объекты вставлены',
		clipboardEmpty: 'Буфер обмена пуст',
		copyError: 'Ошибка при копировании',
		pasteError: 'Ошибка при вставке'
	},
	placeholders: {
		nodeName: 'Введите имя узла',
		riverName: 'Введите название реки',
		name: 'Название'
	},
	dialogs: {
		deleteConfirm: 'Вы уверены, что хотите удалить объект',
		deleteRowTitle: 'Подтвердите удаление'
	},
	fields: {
		protectionName: 'Название защиты',
		excerpt: 'Выдержка',
		source: 'Источник',
		triggeringConditions: 'Условие срабатывания',
		triggeringAlgorithm: 'Алгоритм срабатывания'
	},
	excel: {
		protectionName: 'Наименование защиты',
		excerpt: 'Выдержка времени',
		source: 'Источник',
		triggeringConditions: 'Условия срабатывания',
		triggeringAlgorithm: 'Алгоритм срабатывания',
		fileName: 'Уставки ТО.xlsx'
	},
	dataGrid: {
		labelRowsPerPage: 'Строк на странице',
		labelDisplayedRows: '{{from}}–{{to}} из {{count}}',
		footerRowSelected: '{{count}} строк выбрано',
		columnMenuSortAsc: 'Сортировать по возрастанию',
		columnMenuSortDesc: 'Сортировать по убыванию',
		columnMenuUnsort: 'Отменить сортировку',
		filterPanelAddFilter: 'Добавить фильтр',
		filterPanelOperators: 'Операторы',
		filterPanelOperatorAnd: 'И',
		filterPanelOperatorOr: 'ИЛИ',
		filterPanelColumns: 'Столбцы',
		filterPanelInputLabel: 'Значение',
		filterPanelInputPlaceholder: 'Значение фильтра',
		columnMenuLabel: 'Меню',
		columnMenuShowColumns: 'Управление колонками',
		columnMenuFilter: 'Фильтр',
		columnMenuHideColumn: 'Скрыть',
		columnsManagementSearchTitle: 'Поиск колонки',
		columnsManagementShowHideAllText: 'Показать/Скрыть Всё',
		columnsManagementReset: 'Сбросить',
		noRowsLabel: 'Нет строк',
		noResultsOverlayLabel: 'Не найдено результатов.',
		errorOverlayDefaultLabel: 'Произошла ошибка.',
		columnHeaderFiltersTooltipActive: '{{count}} фильтр активен',
		columnHeaderFiltersLabel: 'Показать фильтры',
		columnHeaderSortIconLabel: 'Сортировать'
	}
} as const
