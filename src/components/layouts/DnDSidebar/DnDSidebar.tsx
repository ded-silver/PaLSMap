import React from 'react'

import { useDnD } from '../../../hooks/DnDContext'

import styles from './DnDSidebar.module.css'

interface Props {
	danet?: boolean
}

export const DnDSidebar = ({ danet }: Props) => {
	const { setType } = useDnD()

	const onDragStart = (event: React.DragEvent, nodeType: string) => {
		setType(nodeType)
		const { dataTransfer } = event
		dataTransfer.effectAllowed = 'move'
	}

	return (
		<aside className={styles.sidebar}>
			<div>
				{danet ? (
					<>
						<div
							className={styles.dndnode}
							onDragStart={e => onDragStart(e, 'Factory')}
							draggable
						>
							Factory
						</div>
						<div
							className={styles.dndnode}
							onDragStart={e => onDragStart(e, 'Object')}
							draggable
						>
							Object
						</div>
						<div
							className={styles.dndnode}
							onDragStart={e => onDragStart(e, 'ParentObject')}
							draggable
						>
							ParentObject
						</div>
						<div
							className={styles.dndnode}
							onDragStart={e => onDragStart(e, 'ChildObject')}
							draggable
						>
							ChildObject
						</div>
					</>
				) : (
					<>
						<div
							className={styles.dndnode}
							onDragStart={e => onDragStart(e, 'OPS')}
							draggable
						>
							OPS
						</div>
						<div
							className={styles.dndnode}
							onDragStart={e => onDragStart(e, 'TankPark')}
							draggable
						>
							TankPark
						</div>
					</>
				)}
			</div>
		</aside>
	)
}
