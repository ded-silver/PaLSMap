import { Box, CircularProgress, Typography } from '@mui/material'
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
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import styles from './MapView.module.css'
import { useDeleteEdge, useEdges, useEdgesByCountry } from '@/entities/edge'
import { useVersion } from '@/entities/map-version'
import type { CustomNode, NodeDto } from '@/entities/node'
import { useNodes, useNodesByCountry } from '@/entities/node'
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
import { COLORS, SIZES } from '@/shared/styles/tokens'
import { DnDSidebar } from '@/widgets/dnd-sidebar'
import { MapToolbar } from '@/widgets/map-toolbar'

const nodeTypes = {
	OPS: OPSNode,
	TankPark: TankParkNode,
	Checkpoint: CheckpointNode,
	River: River
}

interface Props {
	isSidebarOpen: boolean
}

const MapView = ({ isSidebarOpen }: Props) => {
	const { t } = useTranslation(['common', 'nodes', 'map-versions'])
	const { countryId, areaId } = useParams<{
		countryId?: string
		areaId?: string
	}>()
	const [searchParams] = useSearchParams()
	const mode = searchParams.get('mode')
	const versionId = searchParams.get('version')

	const reactFlowWrapper = useRef(null)
	const edgeReconnectSuccessful = useRef(true)
	const isAdmin = useIsAdmin()
	const navigate = useNavigate()

	// Режим просмотра версии
	const isVersionViewMode = !!versionId && !!areaId
	const {
		data: version,
		isLoading: isLoadingVersion,
		error: versionError
	} = useVersion(isVersionViewMode ? versionId : undefined)

	// Обработка ошибки загрузки версии (404)
	useEffect(() => {
		if (isVersionViewMode && versionError) {
			const errorStatus = (versionError as any)?.response?.status
			if (errorStatus === 404) {
				toast.error(t('messages.versionNotFound', { ns: 'map-versions' }))
				// Убираем параметр version из URL
				const newSearchParams = new URLSearchParams(searchParams)
				newSearchParams.delete('version')
				navigate(
					`/map/${countryId}/${areaId}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`,
					{ replace: true }
				)
			}
		}
	}, [
		isVersionViewMode,
		versionError,
		navigate,
		countryId,
		areaId,
		searchParams,
		t
	])

	// Обычная загрузка данных (если не режим просмотра версии)
	const nodesByArea = useNodes(isVersionViewMode ? undefined : areaId)
	const nodesByCountry = useNodesByCountry(
		isVersionViewMode ? '' : countryId || ''
	)
	const nodesAll = useNodes()

	const edgesByArea = useEdges(isVersionViewMode ? undefined : areaId)
	const edgesByCountry = useEdgesByCountry(
		isVersionViewMode ? '' : countryId || ''
	)
	const edgesAll = useEdges()

	const items = isVersionViewMode
		? undefined
		: areaId
			? nodesByArea?.items
			: countryId && mode === 'map'
				? nodesByCountry?.items
				: nodesAll?.items

	const allEgdes = isVersionViewMode
		? undefined
		: areaId
			? edgesByArea?.items
			: countryId && mode === 'map'
				? edgesByCountry?.items
				: edgesAll?.items

	const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

	const { mutate: deleteEdge } = useDeleteEdge()
	const { mutate: node } = useCreateNode()
	const { mutate: deleteNode } = useDeleteNode()

	const handleCreate = useCallback<SubmitHandler<NodeDto>>(
		data => {
			node(data)
		},
		[node]
	)

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
		onCreate: handleCreate,
		pathAreaId: areaId
	})

	const handleNodesDelete = useCallback(
		(deletedNodes: Node[]) => {
			deletedNodes.forEach((node: Node) => {
				deleteNode(node.id)
			})
		},
		[deleteNode]
	)

	const { onNodesChangeWithDebounce } = useNodePositionUpdate({
		onNodesChange
	})

	const { snapshotNodes, snapshotEdges } = useMemo(() => {
		if (!isVersionViewMode || !version?.snapshot) {
			return { snapshotNodes: null, snapshotEdges: null }
		}

		const nodes = version.snapshot.nodes.map(snapshotNode => {
			const nodeTableData = version.snapshot.tableData.filter(
				td => td.nodeDataId === snapshotNode.data.id
			)

			return {
				id: snapshotNode.id,
				type: snapshotNode.type,
				position: snapshotNode.position,
				measured: snapshotNode.measured,
				parentId: snapshotNode.parentId,
				data: {
					id: snapshotNode.data.id,
					label: snapshotNode.data.label,
					handlers: snapshotNode.data.handlers,
					locked: snapshotNode.data.locked,
					visualState: snapshotNode.data.visualState,
					measured: snapshotNode.measured || { width: 0, height: 0 },
					tableData: nodeTableData.map(td => ({
						id: td.nodeDataId,
						protectionName: td.protectionName,
						excerpt: td.excerpt,
						source: td.source,
						triggeringAlgorithm: td.triggeringAlgorithm,
						triggeringConditions: td.triggeringConditions,
						order: td.order
					}))
				},
				locked: snapshotNode.data.locked,
				visualState: snapshotNode.data.visualState,
				draggable: false
			}
		})

		const edges = version.snapshot.edges.map(snapshotEdge => ({
			id: snapshotEdge.id,
			source: snapshotEdge.source,
			target: snapshotEdge.target,
			sourceHandle: snapshotEdge.sourceHandle,
			targetHandle: snapshotEdge.targetHandle,
			type: snapshotEdge.type,
			style: snapshotEdge.style
		}))

		return { snapshotNodes: nodes as Node[], snapshotEdges: edges as Edge[] }
	}, [isVersionViewMode, version])

	useEffect(() => {
		if (snapshotNodes && snapshotEdges) {
			setNodes(snapshotNodes)
			setEdges(snapshotEdges)
		}
	}, [snapshotNodes, snapshotEdges, setNodes, setEdges])

	useEffect(() => {
		if (!isVersionViewMode && items) {
			const nodesWithDraggable = items.map((node: CustomNode) => ({
				...node,
				draggable: isAdmin && !(node.locked ?? false)
			}))
			setNodes(nodesWithDraggable)
		}
	}, [isVersionViewMode, items, setNodes, isAdmin])

	useEffect(() => {
		if (!isVersionViewMode && allEgdes) {
			setEdges(allEgdes)
		}
	}, [isVersionViewMode, allEgdes, setEdges])

	const isReadOnly = isVersionViewMode

	return (
		<>
			<Box
				className={styles['main-content']}
				ref={reactFlowWrapper}
				sx={{ backgroundColor: COLORS.background }}
			>
				{areaId && <MapToolbar areaId={areaId} />}
				{isVersionViewMode && isLoadingVersion && (
					<Box className={styles['version-loading']}>
						<CircularProgress />
						<Typography>
							{t('messages.loadingVersions', { ns: 'map-versions' })}
						</Typography>
					</Box>
				)}
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					onConnect={isReadOnly ? undefined : onConnect}
					onDrop={isReadOnly ? undefined : onDrop}
					onDragOver={isReadOnly ? undefined : onDragOver}
					onNodesChange={isReadOnly ? undefined : onNodesChangeWithDebounce}
					onEdgesChange={isReadOnly ? undefined : onEdgesChange}
					onNodesDelete={isReadOnly ? undefined : handleNodesDelete}
					onReconnectStart={isReadOnly ? undefined : onReconnectStart}
					onReconnect={isReadOnly ? undefined : onReconnect}
					onReconnectEnd={isReadOnly ? undefined : onReconnectEnd}
					snapToGrid
					deleteKeyCode={isReadOnly ? null : ['Delete']}
					snapGrid={[...SIZES.snapGrid]}
					selectionMode={SelectionMode.Partial}
					fitView
					nodesDraggable={!isReadOnly && isAdmin}
					nodesConnectable={!isReadOnly && isAdmin}
					edgesFocusable={!isReadOnly && isAdmin}
					nodesFocusable={!isReadOnly && isAdmin}
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
			{!isReadOnly && <DnDSidebar />}
		</>
	)
}

export default ({ isSidebarOpen }: Props) => (
	<ReactFlowProvider>
		<DnDProvider>
			<MapView isSidebarOpen={isSidebarOpen} />
		</DnDProvider>
	</ReactFlowProvider>
)
