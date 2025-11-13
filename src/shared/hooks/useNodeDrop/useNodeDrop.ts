import { Node, useReactFlow } from '@xyflow/react'
import { nanoid } from 'nanoid'
import { useCallback } from 'react'
import { SubmitHandler } from 'react-hook-form'

import type { NodeDto } from '@/entities/node'
import { useDnD } from '@/shared/hooks/useDnD'

interface UseNodeDropOptions {
	parentId?: string
	onCreate: SubmitHandler<NodeDto>
}

export const useNodeDrop = ({ parentId, onCreate }: UseNodeDropOptions) => {
	const { screenToFlowPosition } = useReactFlow()
	const { type } = useDnD() as {
		type: string | null
		setType: React.Dispatch<React.SetStateAction<string | null>>
	}

	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault()
			event.stopPropagation()

			if (!type) return

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY
			})

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

			const nodeData = parentId
				? ({ ...newNode, parentId } as unknown as NodeDto)
				: (newNode as unknown as NodeDto)
			onCreate(nodeData)
		},
		[screenToFlowPosition, type, parentId, onCreate]
	)

	const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'move'
	}, [])

	return { onDrop, onDragOver }
}
