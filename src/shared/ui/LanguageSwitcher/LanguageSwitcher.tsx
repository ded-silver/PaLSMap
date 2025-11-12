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
			sx={{
				backgroundColor: 'rgba(255, 255, 255, 0.1)',
				color: 'white',
				border: '1px solid rgba(255, 255, 255, 0.2)',
				'& .MuiSelect-select': {
					padding: '4px 32px 4px 8px',
					fontSize: '0.875rem',
					color: 'white'
				},
				'& .MuiOutlinedInput-notchedOutline': {
					borderColor: 'rgba(255, 255, 255, 0.2)'
				},
				'&:hover .MuiOutlinedInput-notchedOutline': {
					borderColor: 'rgba(255, 255, 255, 0.4)'
				},
				'& .MuiSvgIcon-root': {
					color: 'white'
				}
			}}
		>
			<MenuItem value='ru'>Русский</MenuItem>
			<MenuItem value='en'>English</MenuItem>
		</Select>
	)
}
