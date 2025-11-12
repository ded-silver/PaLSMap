import { NodeProps } from '@xyflow/react'

import type { CustomNode } from '../../model/types'
import { SkeletonNode } from '../SkeletonNode'

export const FGUNode = ({ data, id, parentId }: NodeProps<CustomNode>) => {
	return (
		<>
			<SkeletonNode
				width={150}
				height={150}
				variant='FGU'
				id={id}
				name={data.label}
				parentId={parentId}
				isName
				isData
			/>
		</>
	)
}
