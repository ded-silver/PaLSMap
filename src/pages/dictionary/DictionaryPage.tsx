import { Typography } from '@mui/material'
import { useState } from 'react'

import styles from './Dictionary.module.css'
import { SearchBar } from '@/shared/ui'

const abbreviations = [
	{ short: 'НПС', full: 'Нефтеперекачивающая Станция' },
	{ short: 'РП', full: 'Резервуарный парк' },
	{ short: 'КП', full: 'Контрольный пункт' },
	{ short: 'ПНС', full: 'Пункт Насосной Станции' },
	{ short: 'МНС', full: 'Магистральная Насосная Станция' },
	{ short: 'САР', full: 'Система Автоматического регулирования объекта' },
	{ short: 'ФГУ', full: 'Фильтр Грязеуловитель' },
	{
		short: 'КППСОД',
		full: 'Контрольный Пункт Пуска и Приема Средств Очистки и Диагностики'
	}
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
				СПРАВОЧНАЯ ИНФОРМАЦИЯ
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
