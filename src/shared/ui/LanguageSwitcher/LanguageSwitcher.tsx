import { MenuItem, Select, SelectChangeEvent } from '@mui/material'

import { useLanguage } from '../../hooks/useLanguage'

import styles from './LanguageSwitcher.module.css'

export const LanguageSwitcher = () => {
	const { currentLanguage, changeLanguage } = useLanguage()

	const handleChange = (event: SelectChangeEvent<string>) => {
		changeLanguage(event.target.value)
	}

	return (
		<Select
			value={currentLanguage}
			onChange={handleChange}
			size='small'
			className={styles.select}
		>
			<MenuItem value='ru'>Русский</MenuItem>
			<MenuItem value='en'>English</MenuItem>
		</Select>
	)
}
