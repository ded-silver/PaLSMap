export default {
	buttons: {
		save: 'Сохранить',
		cancel: 'Отмена',
		delete: 'Удалить',
		edit: 'Редактировать',
		add: 'Добавить',
		close: 'Закрыть',
		confirm: 'Подтвердить',
		logout: 'Выйти',
		login: 'Войти',
		register: 'Зарегистрироваться',
		copy: 'Копировать',
		paste: 'Вставить'
	},
	titles: {
		dictionary: 'Справочная информация',
		profile: 'Профиль'
	},
	sidebar: {
		home: 'Главная',
		dictionary: 'Справочная информация',
		users: 'Управление пользователями',
		history: 'История изменений'
	},
	messages: {
		loading: 'Загрузка...',
		saving: 'Сохранение...',
		deleting: 'Удаление...',
		uploading: 'Загрузка файла...',
		noResults: 'Ничего не найдено',
		error: 'Ошибка',
		success: 'Успешно',
		errorDeleting: 'Ошибка при удалении',
		errorCreating: 'Ошибка при создании',
		errorUpdating: 'Ошибка при обновлении',
		errorLoading: 'Ошибка при загрузке',
		createdSuccess: 'Запись успешно создана',
		updatedSuccess: 'Запись успешно обновлена',
		deletedSuccess: 'Запись успешно удалена'
	},
	confirmations: {
		delete: 'Вы уверены, что хотите удалить {{item}}?',
		deleteObject: 'Вы уверены, что хотите удалить объект {{name}}?',
		deleteRow: 'Вы уверены, что хотите удалить эту строку?',
		deleteTitle: 'Подтверждение удаления',
		deleteConfirm: 'Вы уверены, что хотите удалить эту запись?'
	},
	labels: {
		email: 'Email',
		password: 'Пароль',
		name: 'ФИО',
		fullName: 'Фамилия Имя Отчество',
		abbreviation: 'Аббревиатура',
		fullNameLabel: 'Полное название'
	},
	placeholders: {
		search: 'Поиск...',
		searchAbbreviations: 'Поиск аббревиатур...',
		email: 'example@mail.com',
		password: '••••••••',
		fullName: 'Фамилия Имя Отчество',
		position: 'Например: Инженер, Администратор'
	},
	errors: {
		required: 'Поле обязательно для заполнения',
		email: 'Email обязателен',
		password: 'Пароль обязателен',
		minLength: 'Минимум {{count}} символов',
		loadError: 'Ошибка при загрузке данных. Пожалуйста, обновите страницу.',
		profileUpdateError: 'Ошибка при обновлении профиля',
		passwordChangeError: 'Ошибка при смене пароля',
		logoutError: 'Ошибка при выходе из системы'
	},
	validation: {
		required: 'Поле обязательно для заполнения',
		passwordMinLength: 'Пароль должен содержать минимум 6 символов',
		passwordsDoNotMatch: 'Пароли не совпадают'
	},
	profile: {
		title: 'Профиль',
		edit: 'Редактировать профиль',
		saveSuccess: 'Профиль успешно обновлен',
		passwordChangedSuccess: 'Пароль успешно изменен',
		requestRights: 'Запросить права администратора',
		requestRightsSuccess: 'Запрос отправлен администратору',
		emailCopied: 'Email скопирован в буфер обмена',
		position: 'Должность',
		role: {
			label: 'Роль',
			admin: 'Администратор',
			user: 'Пользователь',
			superAdmin: 'Суперадминистратор'
		},
		registered: 'Зарегистрирован',
		updated: 'Обновлено',
		dates: {
			created: 'Дата регистрации',
			updated: 'Дата обновления'
		},
		avatar: {
			url: 'URL аватара',
			urlHint: 'Или вставьте ссылку на изображение',
			change: 'Изменить аватар',
			uploadFromDevice: 'Загрузить с устройства',
			uploadSuccess: 'Аватар успешно загружен',
			uploadError: 'Ошибка при загрузке аватара',
			invalidFileType:
				'Недопустимый тип файла. Разрешены: JPEG, PNG, GIF, WebP',
			fileTooLarge: 'Файл слишком большой. Максимальный размер: 5MB'
		},
		security: {
			title: 'Настройки безопасности',
			currentPassword: 'Текущий пароль',
			newPassword: 'Новый пароль',
			confirmPassword: 'Подтверждение пароля',
			changePassword: 'Изменить пароль'
		},
		actions: {
			title: 'Действия',
			logout: 'Выйти из системы',
			logoutConfirmTitle: 'Подтверждение выхода',
			logoutConfirmMessage: 'Вы уверены, что хотите выйти из системы?'
		}
	},
	compass: {
		north: 'С',
		south: 'Ю',
		west: 'З',
		east: 'В'
	},
	dndSidebar: {
		collapse: 'Свернуть',
		expand: 'Развернуть'
	},
	time: {
		justNow: 'Только что',
		minutesAgo: '{{count}} минут назад',
		hoursAgo: '{{count}} часов назад',
		daysAgo: '{{count}} дней назад',
		weeksAgo: '{{count}} недель назад',
		monthsAgo: '{{count}} месяцев назад',
		yearsAgo: '{{count}} лет назад'
	},
	languages: {
		ru: 'Русский',
		en: 'English'
	}
} as const
