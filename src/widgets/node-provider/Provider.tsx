import { Box } from '@mui/material'
import {
	Background,
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
import { useCallback, useEffect, useRef } from 'react'
import { SubmitHandler } from 'react-hook-form'

import styles from './Provider.module.css'
import { useEdges } from '@/entities/edge'
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
import { useIsAdmin } from '@/entities/user'
import { useCreateNode } from '@/features/node-create'
import { useDeleteNode } from '@/features/node-delete'
import {
	DnDProvider,
	useEdgeConnection,
	useNodeDrop,
	useNodePositionUpdate
} from '@/shared/hooks'
import { MUI_STYLES } from '@/shared/styles/mui-styles'
import { COLORS, SIZES } from '@/shared/styles/tokens'
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

	const isAdmin = useIsAdmin()

	const { mutate: node } = useCreateNode()
	const { mutate: deleteNode } = useDeleteNode(['childNodes'])

	const handleCreate: SubmitHandler<NodeDto> = data => {
		node(data)
	}

	const handleNodesDelete = useCallback(
		(deletedNodes: Node[]) => {
			deletedNodes.forEach(node => {
				deleteNode(node.id)
			})
		},
		[deleteNode]
	)

	useEffect(() => {
		if (items) {
			const updatedNodes = items.map(item => ({
				...item,
				style: {
					width: item.measured?.width,
					height: item.measured?.height
				},
				draggable: isAdmin && !(item.locked ?? false)
			}))

			setNodes(updatedNodes)
		}
	}, [items, setNodes, isAdmin])

	useEffect(() => {
		if (allEgdes) {
			setEdges(allEgdes)
		}
	}, [allEgdes, setEdges])

	const { onConnect } = useEdgeConnection({ setEdges })
	const { onDrop, onDragOver } = useNodeDrop({
		parentId: id,
		onCreate: handleCreate
	})
	const { onNodesChangeWithDebounce } = useNodePositionUpdate({
		onNodesChange
	})

	return (
		<>
			<Box
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
				sx={MUI_STYLES.providerWrapper}
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
					snapGrid={[...SIZES.snapGrid]}
					className='react-flow-subflows-example'
					fitView
					deleteKeyCode={null}
					selectionMode={SelectionMode.Partial}
					style={{
						backgroundColor: COLORS.backgroundLight,
						width: '100%',
						height: SIZES.providerHeight
					}}
					nodesDraggable={isAdmin}
					nodesConnectable={isAdmin}
					edgesFocusable={isAdmin}
					nodesFocusable={isAdmin}
				>
					<Controls />
					<Background color={COLORS.backgroundGrid} />
				</ReactFlow>
			</Box>
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
