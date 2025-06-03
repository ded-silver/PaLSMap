module.exports = {
	env: {
		browser: true,
		es2021: true,
		jest: true,
		node: true
	},
	extends: [
		'airbnb',
		'airbnb-typescript',
		'airbnb/hooks',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:react-redux/recommended',
		'prettier'
	],
	settings: {
		'import/core-modules': []
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: './tsconfig.json'
	},
	plugins: [
		'react',
		'@typescript-eslint',
		'import',
		'react-hooks',
		'jsx-a11y',
		'react-redux',
		'prettier'
	],
	rules: {
		'react/display-name': 'off',
		'import/no-extraneous-dependencies': 'off',
		'no-nested-ternary': 'off',
		'prettier/prettier': ['error', { endOfLine: 'auto' }],
		// Отключение запрета спред пропсов
		'react/jsx-props-no-spreading': 'off',
		// Отключение обязательного дефолтного значения для пропсов
		'react/require-default-props': 'off',
		'prettier/prettier': ['error', { endOfLine: 'auto' }],
		// Конец строки LF
		// 'linebreak-style': ['error', 'windows'],
		// Отключает обязательный экспорт по умолчанию
		'import/prefer-default-export': 'off',
		// Разрешает использовать слово default для экспорта в index.ts
		'no-restricted-exports': 'off',
		'no-unused-vars': 'warn',
		'unused-imports/no-unused-imports': 'error',

		'import/no-cycle': 'error',
		// Объявление функционального компонента через стрелочную функцию
		'react/function-component-definition': [
			'error',
			{
				namedComponents: 'arrow-function',
				unnamedComponents: 'arrow-function'
			}
		],
		// Настройки для корректной работы Redux Toolkit
		'no-param-reassign': [
			'error',
			{
				props: true,
				ignorePropertyModificationsFor: ['state', 'action']
			}
		],
		// Настройка правила для React 17 и старше. Разрешает обрабатывать асинхронные функции как обработчики событий.
		'@typescript-eslint/no-misused-promises': [
			'error',
			{ checksVoidReturn: { attributes: false } }
		],
		// Настройка очерёдности импортов
		'import/order': [
			'error',
			{
				alphabetize: {
					order: 'asc',
					caseInsensitive: false
				},
				groups: [
					'builtin',
					'external',
					'internal',
					['parent', 'sibling', 'index', 'object'],
					'type'
				],
				'newlines-between': 'always',
				pathGroups: [
					{
						pattern: 'react',
						group: 'builtin'
					},
					{
						pattern: 'src/',
						group: 'internal'
					},
					{
						pattern: 'features/',
						group: 'internal'
					},
					{
						pattern: 'pages/',
						group: 'internal'
					},
					{
						pattern: 'components/',
						group: 'internal'
					}
				],
				pathGroupsExcludedImportTypes: ['react', 'react-native', 'type']
			}
		]
	},
	// Глобальные переменные
	globals: {
		__IS_DEV__: true,
		__API__: true,
		__BASE__: true
	}
}
