import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import adminEn from './locales/en/admin'
import authEn from './locales/en/auth'
import commonEn from './locales/en/common'
import dictionaryEn from './locales/en/dictionary'
import mapVersionsEn from './locales/en/map-versions'
import nodeHistoryEn from './locales/en/node-history'
import nodesEn from './locales/en/nodes'
import notFoundEn from './locales/en/not-found'
import notificationsEn from './locales/en/notifications'
import pathAreasEn from './locales/en/path-areas'
import validationEn from './locales/en/validation'
import adminRu from './locales/ru/admin'
import authRu from './locales/ru/auth'
import commonRu from './locales/ru/common'
import dictionaryRu from './locales/ru/dictionary'
import mapVersionsRu from './locales/ru/map-versions'
import nodeHistoryRu from './locales/ru/node-history'
import nodesRu from './locales/ru/nodes'
import notFoundRu from './locales/ru/not-found'
import notificationsRu from './locales/ru/notifications'
import pathAreasRu from './locales/ru/path-areas'
import validationRu from './locales/ru/validation'

const resources = {
	ru: {
		common: commonRu,
		auth: authRu,
		dictionary: dictionaryRu,
		nodes: nodesRu,
		validation: validationRu,
		admin: adminRu,
		'node-history': nodeHistoryRu,
		'path-areas': pathAreasRu,
		'not-found': notFoundRu,
		'map-versions': mapVersionsRu,
		notifications: notificationsRu
	},
	en: {
		common: commonEn,
		auth: authEn,
		dictionary: dictionaryEn,
		nodes: nodesEn,
		validation: validationEn,
		admin: adminEn,
		'node-history': nodeHistoryEn,
		'path-areas': pathAreasEn,
		'not-found': notFoundEn,
		'map-versions': mapVersionsEn,
		notifications: notificationsEn
	}
}

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: 'ru',
		defaultNS: 'common',
		interpolation: {
			escapeValue: false
		},
		detection: {
			order: ['localStorage', 'navigator'],
			caches: ['localStorage'],
			lookupLocalStorage: 'i18nextLng'
		},
		debug: false
	})

export default i18n
