import { SvgIconComponent } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import PaletteIcon from '@mui/icons-material/Palette'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'

import type { ActionType } from '../../model/types'

interface ActionIconConfig {
	icon: SvgIconComponent
	color: string
}

export const getActionIcon = (actionType: ActionType): ActionIconConfig => {
	switch (actionType) {
		case 'CREATE':
			return {
				icon: AddIcon,
				color: '#22c55e'
			}
		case 'UPDATE':
			return {
				icon: EditIcon,
				color: '#3b82f6'
			}
		case 'DELETE':
			return {
				icon: DeleteIcon,
				color: '#ef4444'
			}
		case 'MOVE':
			return {
				icon: SwapHorizIcon,
				color: '#f97316'
			}
		case 'LOCK':
			return {
				icon: LockIcon,
				color: '#6b7280'
			}
		case 'UNLOCK':
			return {
				icon: LockOpenIcon,
				color: '#6b7280'
			}
		case 'VISUAL_STATE_CHANGE':
			return {
				icon: PaletteIcon,
				color: '#a855f7'
			}
		case 'PARENT_CHANGE':
		case 'HANDLERS_CHANGE':
		case 'LABEL_CHANGE':
		case 'TYPE_CHANGE':
			return {
				icon: EditIcon,
				color: '#3b82f6'
			}
		default:
			return {
				icon: EditIcon,
				color: '#6b7280'
			}
	}
}
