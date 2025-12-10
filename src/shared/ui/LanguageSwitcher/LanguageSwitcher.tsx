import { MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useLanguage } from '../../hooks/useLanguage'

import styles from './LanguageSwitcher.module.css'

const languageCodes = {
	ru: 'ru',
	en: 'en'
} as const

export const LanguageSwitcher = () => {
	const { currentLanguage, changeLanguage } = useLanguage()
	const { t } = useTranslation('common')

	const handleChange = (event: SelectChangeEvent<string>) => {
		changeLanguage(event.target.value)
	}

	return (
		<Select
			value={currentLanguage}
			onChange={handleChange}
			size='small'
			className={styles.select}
			renderValue={value => {
				return (
					languageCodes[value as keyof typeof languageCodes]?.toUpperCase() ||
					value
				)
			}}
		>
			<MenuItem value='ru'>
				{t('languages.ru')}{' '}
				<Typography
					component='span'
					className={styles.code}
				>
					(ru)
				</Typography>
			</MenuItem>
			<MenuItem value='en'>
				{t('languages.en')}{' '}
				<Typography
					component='span'
					className={styles.code}
				>
					(en)
				</Typography>
			</MenuItem>
		</Select>
	)
}
