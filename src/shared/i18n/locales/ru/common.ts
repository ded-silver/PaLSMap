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
		copy: 'Копировать'
	},
	titles: {
		main: 'ГЕОГРАФИЧЕСКАЯ СХЕМА ТЕХНОЛОГИЧЕСКИХ ОБЪЕКТОВ',
		dictionary: 'СПРАВОЧНАЯ ИНФОРМАЦИЯ',
		profile: 'Профиль'
	},
	sidebar: {
		home: 'Главная',
		dictionary: 'Справочная информация'
	},
	messages: {
		loading: 'Загрузка...',
		saving: 'Сохранение...',
		deleting: 'Удаление...',
		noResults: 'Ничего не найдено',
		error: 'Ошибка',
		success: 'Успешно'
	},
	confirmations: {
		delete: 'Вы уверены, что хотите удалить {{item}}?',
		deleteObject: 'Вы уверены, что хотите удалить объект {{name}}?',
		deleteRow: 'Вы уверены, что хотите удалить эту строку?'
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
		saveSuccess: 'Профиль успешно обновлен',
		passwordChangedSuccess: 'Пароль успешно изменен',
		requestRights: 'Запросить права администратора',
		requestRightsSuccess: 'Запрос отправлен администратору',
		emailCopied: 'Email скопирован в буфер обмена',
		position: 'Должность',
		role: {
			label: 'Права',
			admin: 'Администратор',
			user: 'Пользователь'
		},
		registered: 'Зарегистрирован',
		updated: 'Обновлено',
		avatar: {
			url: 'URL аватара'
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
	}
} as const
