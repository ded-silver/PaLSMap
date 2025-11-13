import { Typography } from '@mui/material'
import {
	Connection,
	Controls,
	Edge,
	Node,
	NodeChange,
	ReactFlow,
	ReactFlowProvider,
	SelectionMode,
	useEdgesState,
	useNodesState,
	useReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import clsx from 'clsx'
import debounce from 'lodash/debounce'
import { nanoid } from 'nanoid'
import React, { useCallback, useEffect, useRef } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './Main.module.css'
import { useCreateEdge, useDeleteEdge, useEdges } from '@/entities/edge'
import type { NodeDto } from '@/entities/node'
import { useNodes } from '@/entities/node'
import { CheckpointNode } from '@/entities/node/ui/CheckpointNode'
import { OPSNode } from '@/entities/node/ui/OPSNode'
import { River } from '@/entities/node/ui/River'
import { TankParkNode } from '@/entities/node/ui/TankParkNode'
import { useCreateNode } from '@/features/node-create'
import { useDeleteNode } from '@/features/node-delete'
import { useUpdateNode } from '@/features/node-update'
import { DnDProvider, useDnD } from '@/shared/hooks'
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
	const { screenToFlowPosition, getNodes } = useReactFlow()
	const isAdmin = localStorage.getItem('isAdmin')

	const { mutate: deleteEdge } = useDeleteEdge()
	const { mutate: node } = useCreateNode()
	const { mutate: deleteNode } = useDeleteNode()
	const { mutate: nodeUpdate } = useUpdateNode()

	const { type } = useDnD() as {
		type: string | null
		setType: React.Dispatch<React.SetStateAction<string | null>>
	}

	const handleCreate: SubmitHandler<NodeDto> = data => {
		node(data)
	}

	const { mutate: createEdge } = useCreateEdge()

	// Создание нового ребра
	const onConnect = useCallback(
		(params: Connection | Edge) => {
			if (params.targetHandle && 'source' in params && 'target' in params) {
				const edge: Edge = {
					...params,
					type: 'straight',
					id: nanoid(),
					style: {
						strokeWidth: 1,
						stroke: 'black'
					}
				}
				setEdges(eds => [...eds, edge])
				createEdge({
					id: edge.id,
					source: edge.source,
					target: edge.target,
					sourceHandle: edge.sourceHandle || null,
					targetHandle: edge.targetHandle || null,
					type: edge.type,
					style: edge.style
						? {
								strokeWidth:
									typeof edge.style.strokeWidth === 'number'
										? edge.style.strokeWidth
										: undefined,
								stroke:
									typeof edge.style.stroke === 'string'
										? edge.style.stroke
										: undefined
							}
						: undefined
				})
			}
		},
		[setEdges, createEdge]
	)

	// Удаление ребра при сбросе на пустое место
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

	// Drop нового узла
	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault()
			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY
			})
			if (!type) return

			const newNode = {
				id: nanoid(),
				type,
				position,
				data: {
					label: '',
					tableName: [],
					tableData: [],
					handlers: [
						{ id: nanoid(), type: 'source' },
						{ id: nanoid(), type: 'target' }
					]
				}
			}
			handleCreate(newNode as unknown as NodeDto)
		},
		[screenToFlowPosition, type]
	)

	const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'move'
	}, [])

	const handleNodesDelete = useCallback((deletedNodes: Node[]) => {
		deletedNodes.forEach(node => {
			deleteNode(node.id)
		})
	}, [])

	useEffect(() => {
		if (items) setNodes(items)
	}, [items])

	useEffect(() => {
		if (allEgdes) setEdges(allEgdes)
	}, [allEgdes])

	const handleNodeUpdate = useCallback(
		debounce((changes: NodeChange[], allNodes: Node[]) => {
			const updatedNodes = changes
				.filter(change => change.type === 'position')
				.map(change => allNodes.find(node => node.id === change.id))
				.filter(Boolean) as Node[]

			updatedNodes.forEach(node => {
				nodeUpdate(node as unknown as NodeDto)
			})
		}, 500),
		[]
	)

	const onNodesChangeWithDebounce = useCallback(
		(changes: NodeChange[]) => {
			onNodesChange(changes)
			const currentNodes = getNodes()
			handleNodeUpdate(changes, currentNodes)
		},
		[onNodesChange, getNodes]
	)

	return (
		<>
			<div
				className={styles['main-content']}
				ref={reactFlowWrapper}
				style={{ backgroundColor: '#e6f0ff' }}
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
					snapGrid={[25, 25]}
					selectionMode={SelectionMode.Partial}
					fitView
					nodesDraggable={isAdmin === 'true'}
					nodesConnectable={isAdmin === 'true'}
					edgesFocusable={isAdmin === 'true'}
					nodesFocusable={isAdmin === 'true'}
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
			</div>
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
