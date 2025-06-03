import { Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	Connection,
	Controls,
	Edge,
	Node,
	NodeChange,
	ReactFlow,
	ReactFlowProvider,
	useEdgesState,
	useNodesState,
	useReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import debounce from 'lodash/debounce'
import { nanoid } from 'nanoid'
import React, { useCallback, useEffect, useRef } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'

import { DnDProvider, useDnD } from '../../../hooks/DnDContext'
import { useCreateEdge } from '../../../hooks/edges/useEdges'
import { useEdges } from '../../../hooks/nodes/useEdges'
import { useNodes } from '../../../hooks/nodes/useNodes'
import { NodeDto, NodeService } from '../../../services/node.service'
import { OPSNode, TankParkNode } from '../../Nodes'
import { DnDSidebar } from '../DnDSidebar'

import styles from './Main.module.css'

const nodeTypes = {
	OPS: OPSNode,
	TankPark: TankParkNode
}

const MMMain = () => {
	const reactFlowWrapper = useRef(null)
	const { items } = useNodes()
	const { items: allEgdes } = useEdges()
	const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
	const { screenToFlowPosition, getNodes } = useReactFlow()
	const queryClient = useQueryClient()

	//Добавление нод
	const { mutate: node } = useMutation({
		mutationKey: ['node'],
		mutationFn: (data: NodeDto) => NodeService.create(data),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
			toast.success('Successfully logged in!')
		},
		onError: error => {
			toast.error('Login or registration failed.')
		}
	})

	const { mutate: deleteNode } = useMutation({
		mutationKey: ['deleteNode'],
		mutationFn: (id: string) => NodeService.delete(id),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
		},
		onError(error: unknown) {
			toast.error('Ошибка при удалении')
		}
	})

	const { mutate: nodeUpdate } = useMutation({
		mutationKey: ['nodeUpdate'],
		mutationFn: (data: NodeDto) => NodeService.update(data.id, data),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['nodes'] })
		},
		onError: error => {
			toast.error('Login or registration failed.')
		}
	})

	const { type } = useDnD() as {
		type: string | null
		setType: React.Dispatch<React.SetStateAction<string | null>>
	}

	const handleCreate: SubmitHandler<NodeDto> = data => {
		node(data)
	}

	//Добавление эджей
	const { mutate: createEdge } = useCreateEdge()

	const onConnect = useCallback(
		(params: Connection | Edge) => {
			if (params.targetHandle) {
				const edge = {
					...params,
					type: 'straight',
					id: nanoid(),
					style: {
						strokeWidth: 1,
						stroke: 'black'
					}
				}
				setEdges(eds => [...eds, edge])

				createEdge(edge)
			}
		},
		[setEdges, createEdge]
	)

	// Обработчик для перетаскивания узлов
	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault()

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY
			})
			if (!type) return

			// Используем состояние для имени узла
			const newNode = {
				id: nanoid(),
				type,
				position,
				data: {
					label: '',
					tableName: [], // Применяем имя узла из состояния
					tableData: [],
					handlers: [
						{
							id: nanoid(),
							type: 'source'
						},
						{
							id: nanoid(),
							type: 'target'
						}
					]
				}
			}

			handleCreate(newNode as unknown as NodeDto)
		},
		[screenToFlowPosition, type]
	)

	// Обработчик события перетаскивания
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
		if (items) {
			setNodes(items)
		}
	}, [items])

	useEffect(() => {
		if (allEgdes) {
			setEdges(allEgdes)
		}
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
			>
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
					snapToGrid
					snapGrid={[1, 1]}
					nodesDraggable
					fitView
				>
					<Typography
						variant='h4'
						className={styles.pageTitle}
					>
						КАРТА УСТАВОК ЗАЩИТЫ
					</Typography>
					<Controls />
				</ReactFlow>
			</div>
			<DnDSidebar />
		</>
	)
}

export default () => (
	<ReactFlowProvider>
		<DnDProvider>
			<MMMain />
		</DnDProvider>
	</ReactFlowProvider>
)
