import { NodeProps } from '@xyflow/react'

import type { CustomNode } from '../../model/types'
import { SkeletonNode } from '../SkeletonNode'

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
				locked={data.locked ?? false}
			/>
		</>
	)
}
