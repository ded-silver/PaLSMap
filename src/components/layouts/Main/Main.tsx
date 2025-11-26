import { Box, Typography } from '@mui/material'
import {
	Connection,
	Controls,
	Edge,
	Node,
	ReactFlow,
	ReactFlowProvider,
	SelectionMode,
	useEdgesState,
	useNodesState
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import clsx from 'clsx'
import React, { useCallback, useEffect, useRef } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './Main.module.css'
import { useDeleteEdge, useEdges } from '@/entities/edge'
import type { NodeDto } from '@/entities/node'
import { useNodes } from '@/entities/node'
import { CheckpointNode } from '@/entities/node/ui/CheckpointNode'
import { OPSNode } from '@/entities/node/ui/OPSNode'
import { River } from '@/entities/node/ui/River'
import { TankParkNode } from '@/entities/node/ui/TankParkNode'
import { useIsAdmin } from '@/entities/user'
import { useCreateNode } from '@/features/node-create'
import { useDeleteNode } from '@/features/node-delete'
import {
	DnDProvider,
	useEdgeConnection,
	useNodeDrop,
	useNodePositionUpdate
} from '@/shared/hooks'
import { COLORS, SIZES } from '@/shared/styles/constants'
import { DnDSidebar } from '@/widgets/dnd-sidebar'

const nodeTypes = {
	OPS: OPSNode,
	TankPark: TankParkNode,
	Checkpoint: CheckpointNode,
	River: River
}

interface Props {
	isSidebarOpen: boolean
}

const MMMain = ({ isSidebarOpen }: Props) => {
	const { t } = useTranslation(['common', 'nodes'])
	const reactFlowWrapper = useRef(null)
	const edgeReconnectSuccessful = useRef(true)
	const { items } = useNodes()
	const { items: allEgdes } = useEdges()
	const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
	const isAdmin = useIsAdmin()

	const { mutate: deleteEdge } = useDeleteEdge()
	const { mutate: node } = useCreateNode()
	const { mutate: deleteNode } = useDeleteNode()

	const handleCreate: SubmitHandler<NodeDto> = data => {
		node(data)
	}

	const { onConnect } = useEdgeConnection({ setEdges })

	const onReconnectStart = useCallback(() => {
		edgeReconnectSuccessful.current = false
	}, [])

	const onReconnect = useCallback(
		(oldEdge: Edge, newConnection: Connection) => {
			edgeReconnectSuccessful.current = true
			setEdges(eds =>
				eds.map(edge =>
					edge.id === oldEdge.id
						? {
								...edge,
								source: newConnection.source,
								target: newConnection.target,
								sourceHandle: newConnection.sourceHandle,
								targetHandle: newConnection.targetHandle
							}
						: edge
				)
			)
		},
		[setEdges]
	)

	const onReconnectEnd = useCallback(
		(_: unknown, edge: Edge) => {
			if (!edgeReconnectSuccessful.current) {
				setEdges(eds => eds.filter(e => e.id !== edge.id))
				deleteEdge(edge.id)
			}
			edgeReconnectSuccessful.current = true
		},
		[setEdges, deleteEdge]
	)

	const { onDrop, onDragOver } = useNodeDrop({
		onCreate: handleCreate
	})

	const handleNodesDelete = useCallback((deletedNodes: Node[]) => {
		deletedNodes.forEach(node => {
			deleteNode(node.id)
		})
	}, [])

	useEffect(() => {
		if (items) {
			const nodesWithDraggable = items.map(node => ({
				...node,
				draggable: isAdmin && !(node.locked ?? false)
			}))
			setNodes(nodesWithDraggable)
		}
	}, [items, setNodes, isAdmin])

	useEffect(() => {
		if (allEgdes) setEdges(allEgdes)
	}, [allEgdes, setEdges])

	const { onNodesChangeWithDebounce } = useNodePositionUpdate({
		onNodesChange
	})

	return (
		<>
			<Box
				className={styles['main-content']}
				ref={reactFlowWrapper}
				sx={{ backgroundColor: COLORS.background }}
			>
				<Typography
					variant='h4'
					className={clsx(styles.pageTitle, { [styles.open]: isSidebarOpen })}
				>
					{t('titles.main')}
				</Typography>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					onConnect={onConnect}
					onDrop={onDrop}
					onDragOver={onDragOver}
					onNodesChange={onNodesChangeWithDebounce}
					onEdgesChange={onEdgesChange}
					onNodesDelete={handleNodesDelete}
					onReconnectStart={onReconnectStart}
					onReconnect={onReconnect}
					onReconnectEnd={onReconnectEnd}
					snapToGrid
					deleteKeyCode={['Delete']}
					snapGrid={[...SIZES.snapGrid]}
					selectionMode={SelectionMode.Partial}
					fitView
					nodesDraggable={isAdmin}
					nodesConnectable={isAdmin}
					edgesFocusable={isAdmin}
					nodesFocusable={isAdmin}
				>
					<Controls />
				</ReactFlow>
				<div className={styles.compass}>
					<div className={styles.needle}></div>
					<div className={styles.labelNorth}>{t('compass.north')}</div>
					<div className={styles.labelSouth}>{t('compass.south')}</div>
					<div className={styles.labelWest}>{t('compass.west')}</div>
					<div className={styles.labelEast}>{t('compass.east')}</div>
				</div>
			</Box>
			<DnDSidebar />
		</>
	)
}

export default ({ isSidebarOpen }: Props) => (
	<ReactFlowProvider>
		<DnDProvider>
			<MMMain isSidebarOpen={isSidebarOpen} />
		</DnDProvider>
	</ReactFlowProvider>
)
