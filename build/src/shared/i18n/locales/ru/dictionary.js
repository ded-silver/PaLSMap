export default {
    title: 'СПРАВОЧНАЯ ИНФОРМАЦИЯ',
    buttons: {
        add: 'Добавить запись',
        edit: 'Редактировать запись'
    },
    fields: {
        short: 'Аббревиатура',
        full: 'Полное название'
    },
    validation: {
        shortRequired: 'Аббревиатура обязательна для заполнения',
        shortMinLength: 'Аббревиатура должна содержать хотя бы 1 символ',
        fullRequired: 'Полное название обязательно для заполнения',
        fullMinLength: 'Полное название должно содержать хотя бы 1 символ'
    },
    messages: {
        empty: 'Справочник пуст',
        noResults: 'Ничего не найдено',
        deleteConfirm: 'Вы уверены, что хотите удалить запись?',
        abbreviation: 'Аббревиатура:',
        fullName: 'Полное название:',
        deleteTitle: 'Подтверждение удаления',
        createSuccess: 'Запись успешно создана',
        updateSuccess: 'Запись успешно обновлена',
        deleteSuccess: 'Запись успешно удалена',
        createError: 'Ошибка при создании записи',
        updateError: 'Ошибка при обновлении записи',
        deleteError: 'Ошибка при удалении записи',
        duplicateError: 'Аббревиатура уже существует',
        forbiddenError: 'Недостаточно прав для выполнения операции',
        unauthorizedError: 'Необходима авторизация',
        notFoundError: 'Запись не найдена'
    }
};
