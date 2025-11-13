import { Connection, Edge, useEdgesState } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { useCallback } from 'react'

import { useCreateEdge } from '@/entities/edge'
import { EDGE_STYLES } from '@/shared/styles/constants'

interface UseEdgeConnectionOptions {
	setEdges: ReturnType<typeof useEdgesState<Edge>>[1]
}

export const useEdgeConnection = ({ setEdges }: UseEdgeConnectionOptions) => {
	const { mutate: createEdge } = useCreateEdge()

	const onConnect = useCallback(
		(params: Connection | Edge) => {
			const hasTargetHandle =
				'targetHandle' in params && params.targetHandle !== undefined
			const hasSourceAndTarget =
				'source' in params &&
				'target' in params &&
				params.source &&
				params.target

			if (hasTargetHandle && hasSourceAndTarget) {
				const edge: Edge = {
					...params,
					type: 'straight',
					id: nanoid(),
					style: EDGE_STYLES.default
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

	return { onConnect }
}
