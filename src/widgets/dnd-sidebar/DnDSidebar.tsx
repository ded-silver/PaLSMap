import React from 'react'

import { useDnD } from '@/shared/hooks'

import styles from './DnDSidebar.module.css'

interface Props {
	currentNodeType?: 'TankPark' | 'OPS' | 'Checkpoint'
}

export const DnDSidebar = ({ currentNodeType }: Props) => {
	const { setType } = useDnD()

	const isAdmin = localStorage.getItem('isAdmin')

	const onDragStart = (event: React.DragEvent, nodeType: string) => {
		setType(nodeType)
		const { dataTransfer } = event
		dataTransfer.effectAllowed = 'move'
	}

	return (
		<>
			{isAdmin === 'true' ? (
				<aside className={styles.sidebar}>
					<div>
						{currentNodeType === 'Checkpoint' ? (
							<>
								{/* Factory */}
								<div
									className={styles.dndnode}
									onDragStart={e => onDragStart(e, 'Factory')}
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
									draggable
									title='САР'
								>
									<div className={styles.container_sar}></div>
								</div>

								{/* KPPSOD */}
								<div
									className={styles.dndnode}
									onDragStart={e => onDragStart(e, 'KPPSOD')}
									draggable
									title='КППСОД'
								>
									<div className={styles.container_kppsod}></div>
								</div>

								{/* FGU */}
								<div
									className={styles.dndnode}
									onDragStart={e => onDragStart(e, 'FGU')}
									draggable
									title='ФГУ'
								>
									<div className={styles.container_fgu}></div>
								</div>

								{/* PNS */}
								<div
									className={styles.dndnode}
									onDragStart={e => onDragStart(e, 'PNS')}
									draggable
									title='ПНС'
								>
									<div className={styles.container_pns}></div>
								</div>

								{/* MNS */}
								<div
									className={styles.dndnode}
									onDragStart={e => onDragStart(e, 'MNS')}
									draggable
									title='МНС'
								>
									<div className={styles.container_mns}></div>
								</div>

								{/* ChildObject */}
								{/* <div
									className={styles.dndnode}
									onDragStart={e => onDragStart(e, 'ChildObject')}
									draggable
									title='Вложенный объект'
								>
									<div className={styles['children-square-container']}>
										<div className={styles['children-square']}></div>
									</div>
								</div> */}

								{/* Capacity */}
								<div
									className={styles.dndnode}
									onDragStart={e => onDragStart(e, 'Capacity')}
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
									draggable
									title='Резервуарный парк'
								>
									<div className={styles['chart-cylinder']}></div>
								</div>

								{/* Checkpoint */}
								<div
									className={styles.dndnode}
									onDragStart={e => onDragStart(e, 'Checkpoint')}
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
			) : null}
		</>
	)
}
