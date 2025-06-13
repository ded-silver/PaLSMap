import { NodeProps } from '@xyflow/react'

import { CustomNode } from '../../../types/nodeTypes'
import { SkeletonNode } from '../components'

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
