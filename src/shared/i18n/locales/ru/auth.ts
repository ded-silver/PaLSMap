export default {
	tabs: {
		login: 'Вход',
		register: 'Регистрация'
	},
	fields: {
		name: 'ФИО (необязательно)',
		namePlaceholder: 'Иванов Иван Иванович'
	},
	buttons: {
		login: 'Войти',
		register: 'Зарегистрироваться'
	},
	validation: {
		emailRequired: 'Email обязателен',
		passwordRequired: 'Пароль обязателен'
	},
	messages: {
		loginError: 'Ошибка входа',
		registerError: 'Ошибка регистрации'
	}
} as const
