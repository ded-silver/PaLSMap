import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './DnDSidebar.module.css'
import { useIsAdmin } from '@/entities/user'
import { useDnD } from '@/shared/hooks'

interface Props {
	currentNodeType?: 'TankPark' | 'OPS' | 'Checkpoint'
}

export const DnDSidebar = ({ currentNodeType }: Props) => {
	const { setType } = useDnD()
	const { t } = useTranslation('common')
	const isAdmin = useIsAdmin()
	const [isCollapsed, setIsCollapsed] = useState(false)

	const toggleCollapse = () => {
		setIsCollapsed(prev => !prev)
	}

	const onDragStart = (event: React.DragEvent, nodeType: string) => {
		setType(nodeType)
		const { dataTransfer } = event
		dataTransfer.effectAllowed = 'move'

		const target = event.currentTarget as HTMLElement
		target.classList.add(styles.dragging)
	}

	const onDragEnd = (event: React.DragEvent) => {
		const target = event.currentTarget as HTMLElement
		target.classList.remove(styles.dragging)
	}

	return (
		<>
			{isAdmin ? (
				<div
					className={`${styles.wrapper} ${isCollapsed ? styles.collapsed : ''}`}
				>
					<button
						className={styles.toggleButton}
						onClick={toggleCollapse}
						title={
							isCollapsed ? t('dndSidebar.expand') : t('dndSidebar.collapse')
						}
						type='button'
					>
						{isCollapsed ? (
							<KeyboardArrowUpIcon fontSize='small' />
						) : (
							<KeyboardArrowDownIcon fontSize='small' />
						)}
					</button>
					<aside className={styles.sidebar}>
						<div className={styles.content}>
							{currentNodeType === 'Checkpoint' ? (
								<>
									{/* Factory */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'Factory')}
										onDragEnd={onDragEnd}
										draggable
										title='Объект'
									>
										<div className={styles['factory-square-container']}>
											<div className={styles['factory-square']}></div>
										</div>
									</div>

									{/* Valve */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'Valve')}
										onDragEnd={onDragEnd}
										draggable
										title='Задвижка'
									>
										<div className={styles.container_valve}>
											<div className={styles['triangle-left']}></div>
											<div className={styles['triangle-right']}></div>
										</div>
									</div>

									{/* AccountingSystem */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'AccountingSystem')}
										onDragEnd={onDragEnd}
										draggable
										title='Система учета'
									>
										<div className={styles.container_accountingsystem}>
											<div className={styles.innerCircle}></div>
										</div>
									</div>
								</>
							) : currentNodeType === 'TankPark' ? (
								<>
									{/* Factory */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'Factory')}
										onDragEnd={onDragEnd}
										draggable
										title='Объект'
									>
										<div className={styles['factory-square-container']}>
											<div className={styles['factory-square']}></div>
										</div>
									</div>

									{/* ChildTankPark */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'ChildTankPark')}
										onDragEnd={onDragEnd}
										draggable
										title='Резервуарный парк'
									>
										<div className={styles['chart-cylinder']}></div>
									</div>
								</>
							) : currentNodeType === 'OPS' ? (
								<>
									{/* Factory */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'Factory')}
										onDragEnd={onDragEnd}
										draggable
										title='Объект'
									>
										<div className={styles['factory-square-container']}>
											<div className={styles['factory-square']}></div>
										</div>
									</div>

									{/* SAR */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'SAR')}
										onDragEnd={onDragEnd}
										draggable
										title='САР'
									>
										<div className={styles.container_sar}></div>
									</div>

									{/* KPPSOD */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'KPPSOD')}
										onDragEnd={onDragEnd}
										draggable
										title='КППСОД'
									>
										<div className={styles.container_kppsod}></div>
									</div>

									{/* FGU */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'FGU')}
										onDragEnd={onDragEnd}
										draggable
										title='ФГУ'
									>
										<div className={styles.container_fgu}></div>
									</div>

									{/* PNS */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'PNS')}
										onDragEnd={onDragEnd}
										draggable
										title='ПНС'
									>
										<div className={styles.container_pns}></div>
									</div>

									{/* MNS */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'MNS')}
										onDragEnd={onDragEnd}
										draggable
										title='МНС'
									>
										<div className={styles.container_mns}></div>
									</div>

									{/* Capacity */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'Capacity')}
										onDragEnd={onDragEnd}
										draggable
										title='Ёмкость'
									>
										<div className={styles['capacity-circle-container']}>
											<div className={styles['capacity-chart-cylinder']}></div>
										</div>
									</div>

									{/* Valve */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'Valve')}
										onDragEnd={onDragEnd}
										draggable
										title='Задвижка'
									>
										<div className={styles.container_valve}>
											<div className={styles['triangle-left']}></div>
											<div className={styles['triangle-right']}></div>
										</div>
									</div>

									{/* Pump */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'Pump')}
										onDragEnd={onDragEnd}
										draggable
										title='Насос'
									>
										<div className={styles.container_pump}>
											<div className={styles['triangle-wrapper']}>
												<div className={styles.triangle}></div>
											</div>
										</div>
									</div>

									{/* AccountingSystem */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'AccountingSystem')}
										onDragEnd={onDragEnd}
										draggable
										title='Система учета'
									>
										<div className={styles.container_accountingsystem}>
											<div className={styles.innerCircle}></div>
										</div>
									</div>
								</>
							) : (
								<>
									{/* OPS */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'OPS')}
										onDragEnd={onDragEnd}
										draggable
										title='НПС'
									>
										<div className={styles['circle-container']}>
											<div className={styles.circle}>
												<div className={styles.cross}></div>
											</div>
										</div>
									</div>

									{/* TankPark */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'TankPark')}
										onDragEnd={onDragEnd}
										draggable
										title='Резервуарный парк'
									>
										<div className={styles['chart-cylinder']}></div>
									</div>

									{/* Checkpoint */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'Checkpoint')}
										onDragEnd={onDragEnd}
										draggable
										title='Контрольный пункт'
									>
										<div className={styles['lime-square-container']}>
											<div className={styles['lime-square']}></div>
										</div>
									</div>

									{/* River */}
									<div
										className={styles.dndnode}
										onDragStart={e => onDragStart(e, 'River')}
										onDragEnd={onDragEnd}
										draggable
										title='Река'
									>
										<div className={styles['river-line-container']}>
											<div className={styles['river-line']} />
										</div>
									</div>
								</>
							)}
						</div>
					</aside>
				</div>
			) : null}
		</>
	)
}
