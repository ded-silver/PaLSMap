import { NodeProps } from '@xyflow/react'

import { CustomNode } from '../../../types/nodeTypes'
import { SkeletonNode } from '../components'

export const MNSNode = ({ data, id, parentId }: NodeProps<CustomNode>) => {
	return (
		<>
			<SkeletonNode
				width={600}
				height={250}
				variant='MNS'
				id={id}
				name={data.label}
				parentId={parentId}
				isName
				isData
			/>
		</>
	)
}
