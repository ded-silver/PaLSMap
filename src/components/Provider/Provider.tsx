import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	Background,
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
import debounce from 'lodash/debounce'
import { nanoid } from 'nanoid'
import { useCallback, useEffect, useRef } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'

import { DnDProvider, useDnD } from '../../hooks/DnDContext'
import { useCreateEdge } from '../../hooks/edges/useEdges'
import { useEdges } from '../../hooks/nodes/useEdges'
import { useChildNodes } from '../../hooks/nodes/useNodes'
import { NodeService } from '../../services/node.service'
import { NodeDto } from '../../types/nodeTypes'
import { ChildObjectNode, FactoryNode, ObjectNode } from '../Nodes'
import { AccountingSystemNode } from '../Nodes/AccountingSystemNode'
import { CapacityNode } from '../Nodes/CapacityNode'
import { ChildTankParkNode } from '../Nodes/ChildTankParkNode'
import { FGUNode } from '../Nodes/FGUNode/FGUNode'
import { KPPSODNode } from '../Nodes/KPPSODNode/KPPSODNode'
import { MNSNode } from '../Nodes/MNSNode'
import { PNSNode } from '../Nodes/PNSNode'
import { PumpNode } from '../Nodes/PumpNode'
import { SARNode } from '../Nodes/SARNode'
import { ValveNode } from '../Nodes/ValveNode'
import { DnDSidebar } from '../layouts/DnDSidebar'

import styles from './Provider.module.css'

const nodeTypes = {
	Factory: FactoryNode,
	Object: ObjectNode,
	MNSNode: MNSNode,
	ChildObject: ChildObjectNode,
	Valve: ValveNode,
	Pump: PumpNode,
	AccountingSystem: AccountingSystemNode,
	ChildTankPark: ChildTankParkNode,
	PNS: PNSNode,
	MNS: MNSNode,
	SAR: SARNode,
	FGU: FGUNode,
	KPPSOD: KPPSODNode,
	Capacity: CapacityNode
}

interface Props {
	id: string
	currentNodeType?: 'OPS' | 'TankPark' | 'Checkpoint'
}

export const Provider = ({ id, currentNodeType }: Props) => {
	const reactFlowWrapper = useRef(null)
	const { items } = useChildNodes(id)
	const { items: allEgdes } = useEdges()
	const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
	const { screenToFlowPosition, getNodes } = useReactFlow()
	const queryClient = useQueryClient()

	const isAdmin = localStorage.getItem('isAdmin')

	const { type } = useDnD() as {
		type: string | null
		setType: React.Dispatch<React.SetStateAction<string | null>>
	}

	const { mutate: node } = useMutation({
		mutationKey: ['childNode'],
		mutationFn: (data: NodeDto) => NodeService.create(data),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
			toast.success('Объект успешно добавлен')
		},
		onError: error => {
			toast.error('Ошибка при добавлении.')
		}
	})

	const { mutate: deleteNode } = useMutation({
		mutationKey: ['deleteChildNode'],
		mutationFn: (nodeId: string) => NodeService.delete(nodeId),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
		},
		onError(error: unknown) {
			toast.error('Ошибка при удалении')
		}
	})

	const { mutate: nodeUpdate } = useMutation({
		mutationKey: ['childNodeUpdate'],
		mutationFn: (data: NodeDto) => NodeService.update(data.id, data),
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['childNodes'] })
		},
		onError: error => {
			toast.error('Ошибка при обновлении.')
		}
	})

	const handleCreate: SubmitHandler<NodeDto> = data => {
		node(data)
	}

	const handleNodesDelete = useCallback((deletedNodes: Node[]) => {
		deletedNodes.forEach(node => {
			deleteNode(node.id)
		})
	}, [])

	useEffect(() => {
		if (items) {
			const updatedNodes = items.map(item => ({
				...item,
				style: {
					width: item.measured?.width,
					height: item.measured?.height
				}
			}))

			setNodes(updatedNodes)
		}
	}, [items])

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

	//Добавление эджей
	const { mutate: createEdge } = useCreateEdge()

	useEffect(() => {
		if (allEgdes) {
			setEdges(allEgdes)
		}
	}, [allEgdes])

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
			event.stopPropagation()

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY
			})
			if (!type) return

			// Используем состояние для имени узла
			const newNode: Node = {
				id: nanoid(),
				type,
				position,
				data: {
					label: '',
					tableName: [], // Имя узла из состояния
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

			handleCreate({ ...newNode, parentId: id } as unknown as NodeDto)
		},
		[screenToFlowPosition, type]
	)

	// Обработчик события перетаскивания
	const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'move'
	}, [])

	return (
		<>
			<div
				className={styles['provider-content']}
				ref={reactFlowWrapper}
				onDrop={e => {
					e.preventDefault()
					e.stopPropagation()
				}}
				onDragOver={e => {
					e.preventDefault()
					e.stopPropagation()
				}}
				style={{ zIndex: 9999, backgroundColor: '#e6f0ff' }}
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
					snapGrid={[25, 25]}
					className='react-flow-subflows-example'
					fitView
					deleteKeyCode={null}
					selectionMode={SelectionMode.Partial}
					style={{
						backgroundColor: '#F7F9FB',
						width: '100%',
						height: '400px'
					}}
					nodesDraggable={isAdmin === 'true' ? true : false}
					nodesConnectable={isAdmin === 'true' ? true : false}
					// elementsSelectable={isAdmin === 'true' ? true : false}
					edgesFocusable={isAdmin === 'true' ? true : false}
					nodesFocusable={isAdmin === 'true' ? true : false}
				>
					<Controls />
					<Background color='#E6E6E6' />
				</ReactFlow>
			</div>
			<DnDSidebar currentNodeType={currentNodeType} />
		</>
	)
}

export default ({ id, currentNodeType }: Props) => (
	<ReactFlowProvider>
		<DnDProvider>
			<Provider
				id={id}
				currentNodeType={currentNodeType}
			/>
		</DnDProvider>
	</ReactFlowProvider>
)
