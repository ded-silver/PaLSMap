export default {
	labels: {
		countries: 'Страны',
		pathAreas: 'Области',
		country: 'Страна',
		pathArea: 'Область',
		createCountry: 'Создать страну',
		createPathArea: 'Создать область',
		openMap: 'Открыть карту',
		noCountries: 'Нет стран',
		noPathAreas: 'Нет областей',
		name: 'Название',
		code: 'Код'
	},
	actions: {
		create: 'Создать',
		back: 'Назад'
	},
	validation: {
		nameRequired: 'Название обязательно для заполнения',
		nameMinLength: 'Название должно содержать хотя бы 1 символ',
		countryRequired: 'Страна обязательна для выбора'
	},
	messages: {
		deleteTitle: 'Подтверждение удаления',
		deleteConfirm: 'Вы уверены, что хотите удалить эту запись?',
		createSuccess: 'Запись успешно создана',
		updateSuccess: 'Запись успешно обновлена',
		deleteSuccess: 'Запись успешно удалена',
		createError: 'Ошибка при создании записи',
		updateError: 'Ошибка при обновлении записи',
		deleteError: 'Ошибка при удалении записи',
		duplicateError: 'Запись с таким названием уже существует',
		forbiddenError: 'Недостаточно прав для выполнения операции',
		unauthorizedError: 'Необходима авторизация',
		notFoundError: 'Запись не найдена'
	},
	errors: {
		invalidCountry: 'Неверный идентификатор страны',
		loadError: 'Ошибка при загрузке данных'
	}
} as const
