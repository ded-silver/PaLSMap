import { Node, NodeChange, useReactFlow } from '@xyflow/react'
import debounce from 'lodash/debounce'
import { useCallback } from 'react'

import type { NodeDto } from '@/entities/node'
import { useUpdateNode } from '@/features/node-update'

interface UseNodePositionUpdateOptions {
	onNodesChange: (changes: NodeChange[]) => void
}

export const useNodePositionUpdate = ({
	onNodesChange
}: UseNodePositionUpdateOptions) => {
	const { getNodes } = useReactFlow()
	const { mutate: nodeUpdate } = useUpdateNode(['childNodes'])

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
		[nodeUpdate]
	)

	const onNodesChangeWithDebounce = useCallback(
		(changes: NodeChange[]) => {
			onNodesChange(changes)
			const currentNodes = getNodes()
			handleNodeUpdate(changes, currentNodes)
		},
		[onNodesChange, getNodes, handleNodeUpdate]
	)

	return { onNodesChangeWithDebounce }
}
