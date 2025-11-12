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
		register: 'Зарегистрироваться'
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
		fullName: 'Фамилия Имя Отчество'
	},
	errors: {
		required: 'Поле обязательно для заполнения',
		email: 'Email обязателен',
		password: 'Пароль обязателен',
		minLength: 'Минимум {{count}} символов',
		loadError: 'Ошибка при загрузке данных. Пожалуйста, обновите страницу.',
		profileUpdateError: 'Ошибка при обновлении профиля'
	},
	profile: {
		requestRights: 'Запросить права',
		requestRightsSuccess: 'Ваш запрос на повышение прав отправлен',
		saveSuccess: 'Изменения сохранены'
	}
} as const
