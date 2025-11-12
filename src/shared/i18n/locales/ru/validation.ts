export default {
	required: 'Поле обязательно для заполнения',
	minLength: 'Минимум {{count}} символов',
	maxLength: 'Максимум {{count}} символов',
	email: 'Некорректный email',
	password: 'Пароль должен содержать минимум 6 символов',
	protectionNameRequired: 'Поле "Название защиты" обязательно для заполнения',
	excerptRequired: 'Поле "Выдержка" обязательно для заполнения',
	sourceRequired: 'Поле "Источник" обязательно для заполнения',
	triggeringConditionsRequired:
		'Поле "Условие срабатывания" обязательно для заполнения',
	triggeringAlgorithmRequired:
		'Поле "Алгоритм срабатывания" обязательно для заполнения'
} as const
