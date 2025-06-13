import { NodeProps } from '@xyflow/react'

import { CustomNode } from '../../../types/nodeTypes'
import { SkeletonNode } from '../components'

export const SARNode = ({ data, id, parentId }: NodeProps<CustomNode>) => {
	return (
		<>
			<SkeletonNode
				width={150}
				height={150}
				variant='SAR'
				id={id}
				name={data.label}
				parentId={parentId}
				isName
				isData
			/>
		</>
	)
}
