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

import styles from './Provider.module.css'
import { useCreateEdge, useEdges } from '@/entities/edge'
import type { NodeDto } from '@/entities/node'
import { useChildNodes } from '@/entities/node'
import { AccountingSystemNode } from '@/entities/node/ui/AccountingSystemNode'
import { CapacityNode } from '@/entities/node/ui/CapacityNode'
import { ChildObjectNode } from '@/entities/node/ui/ChildObjectNode'
import { ChildTankParkNode } from '@/entities/node/ui/ChildTankParkNode'
import { FGUNode } from '@/entities/node/ui/FGUNode'
import { FactoryNode } from '@/entities/node/ui/FactoryNode'
import { KPPSODNode } from '@/entities/node/ui/KPPSODNode'
import { MNSNode } from '@/entities/node/ui/MNSNode'
import { ObjectNode } from '@/entities/node/ui/ObjectNode'
import { PNSNode } from '@/entities/node/ui/PNSNode'
import { PumpNode } from '@/entities/node/ui/PumpNode'
import { SARNode } from '@/entities/node/ui/SARNode'
import { ValveNode } from '@/entities/node/ui/ValveNode'
import { useCreateNode } from '@/features/node-create'
import { useDeleteNode } from '@/features/node-delete'
import { useUpdateNode } from '@/features/node-update'
import { DnDProvider, useDnD } from '@/shared/hooks'
import { DnDSidebar } from '@/widgets/dnd-sidebar'

const nodeTypes = {
	Factory: FactoryNode,
	Object: ObjectNode,
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

	const isAdmin = localStorage.getItem('isAdmin')

	const { type } = useDnD() as {
		type: string | null
		setType: React.Dispatch<React.SetStateAction<string | null>>
	}

	const { mutate: node } = useCreateNode()
	const { mutate: deleteNode } = useDeleteNode(['childNodes'])
	const { mutate: nodeUpdate } = useUpdateNode(['childNodes'])

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

	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault()
			event.stopPropagation()

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY
			})
			if (!type) return

			const newNode: Node = {
				id: nanoid(),
				type,
				position,
				data: {
					label: '',
					tableName: [],
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
