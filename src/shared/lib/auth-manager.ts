import { clearClientStorage } from './auth-token'
import { queryClient } from './query-client'

export const resetAuthState = () => {
	clearClientStorage()
	queryClient.clear()
}
