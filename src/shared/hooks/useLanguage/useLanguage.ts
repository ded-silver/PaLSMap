import { useTranslation } from 'react-i18next'

export const useLanguage = () => {
	const { i18n } = useTranslation()

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng)
		localStorage.setItem('i18nextLng', lng)
	}

	return {
		currentLanguage: i18n.language,
		changeLanguage
	}
}
