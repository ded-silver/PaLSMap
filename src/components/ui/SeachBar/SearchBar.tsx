import { FC, InputHTMLAttributes, useRef, useState } from 'react'

import './SearchBar.scss'

type Props = InputHTMLAttributes<HTMLInputElement>

export const SearchBar: FC<Props> = ({ ...props }) => {
	const [expanded, setExpanded] = useState(false)
	const inputRef = useRef<HTMLInputElement | null>(null)
	const containerRef = useRef<HTMLDivElement | null>(null)

	const handleExpand = () => {
		setExpanded(true)
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}

	const handleBlur = () => {
		if (
			inputRef.current &&
			inputRef.current.value.trim() === '' &&
			expanded === true
		) {
			setExpanded(false)
		}
	}

	return (
		<div
			ref={containerRef}
			className={`search-bar ${expanded ? 'expanded' : ''}`}
		>
			<input
				{...props}
				className='search-input'
				ref={inputRef}
				type='text'
				// placeholder='Поиск уставок...'
				onBlur={handleBlur}
			/>
			<button
				className='search-btn'
				type='button'
				onClick={expanded ? () => setExpanded(false) : handleExpand}
			>
				<svg
					width='20px'
					height='20px'
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g
						id='SVGRepo_bgCarrier'
						strokeWidth='0'
					/>
					<g
						id='SVGRepo_tracerCarrier'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
					<g id='SVGRepo_iconCarrier'>
						<path
							d='M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z'
							stroke='#343743'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</g>
				</svg>
			</button>
		</div>
	)
}
