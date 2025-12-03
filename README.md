# MOPS Frontend

Frontend приложение для системы управления картой объектов и путей (MOPS / PaLSMap).

## Технологии

React, TypeScript, React Router, React Query, Material-UI, React Flow, i18n, Redux Toolkit, Vite

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Настройка .env
VITE_API_BASE_URL="http://localhost:4201"

# Запуск
npm run dev
```

## Роли пользователей

- **user** - просмотр карт
- **admin** - редактирование, история
- **superAdmin** - управление пользователями

## Основные страницы

- `/auth` - аутентификация
- `/map` - список стран и карты
- `/map/:countryId/:areaId` - интерактивная карта с нодами
- `/dictionary` - словарь терминов
- `/profile` - профиль пользователя
- `/admin/users` - управление пользователями (только для superAdmin)
- `/node-history` - история изменений (только для админов)

## Скрипты

```bash
npm run dev       # Разработка
npm run build     # Сборка
npm run preview   # Preview production build
npm run lint      # Линтинг
```
