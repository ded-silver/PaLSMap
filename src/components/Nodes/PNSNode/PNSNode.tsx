import { NodeProps } from '@xyflow/react'

import { CustomNode } from '../../../types/nodeTypes'
import { SkeletonNode } from '../components'

export const PNSNode = ({ data, id, parentId }: NodeProps<CustomNode>) => {
	return (
		<>
			<SkeletonNode
				width={600}
				height={250}
				variant='PNS'
				id={id}
				name={data.label}
				parentId={parentId}
				isName
				isData
			/>
		</>
	)
}
