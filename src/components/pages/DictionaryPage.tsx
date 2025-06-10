import { Typography } from '@mui/material'
import { useState } from 'react'

import { SearchBar } from '../ui/SeachBar/SearchBar'

import styles from './Dictionary.module.css'

const abbreviations = [
	{ short: 'НПС', full: 'Насосная Перекачивающая Станция' },
	{ short: 'ДУ', full: 'Диаметр Условный' },
	{ short: 'ПЛК', full: 'Программируемый Логический Контроллер' },
	{ short: 'РП', full: 'Резервуарный парк' }
]

export const DictionaryPage = () => {
	const [searchTerm, setSearchTerm] = useState('')

	const filteredAbbreviations = abbreviations.filter(
		({ short, full }) =>
			short.toLowerCase().includes(searchTerm.toLowerCase()) ||
			full.toLowerCase().includes(searchTerm.toLowerCase())
	)

	return (
		<div className={styles['main-content']}>
			<Typography
				sx={{ fontSize: '2.125rem' }}
				className={styles.pageTitle}
				gutterBottom
			>
				СЛОВАРЬ АББРЕВИАТУР
			</Typography>

			<div className={styles.searchBarWrapper}>
				<SearchBar
					placeholder='Поиск аббревиатур...'
					onChange={e => setSearchTerm(e.target.value)}
				/>
			</div>

			<div className={styles.abbreviationList}>
				{filteredAbbreviations.length > 0 ? (
					filteredAbbreviations.map(({ short, full }) => (
						<div
							key={short}
							className={styles.abbreviationItem}
						>
							<div className={styles.short}>{short}</div>
							<div className={styles.full}>{full}</div>
						</div>
					))
				) : (
					<div className={styles.noResults}>Ничего не найдено</div>
				)}
			</div>
		</div>
	)
}
