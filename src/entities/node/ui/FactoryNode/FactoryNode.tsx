import { NodeProps } from '@xyflow/react'

import type { CustomNode } from '../../model/types'
import { SkeletonNode } from '../SkeletonNode'

export const FactoryNode = ({ data, id, parentId }: NodeProps<CustomNode>) => {
	return (
		<SkeletonNode
			id={id}
			width={1200}
			height={1200}
			variant='Factory'
			name={data.label}
			parentId={parentId}
			// isName
			// isData
		/>
	)
}
