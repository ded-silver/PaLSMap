import '../App.css'

import { QueryProvider } from './providers'
import { Router } from './router'

export const App = () => {
	return (
		<QueryProvider>
			<Router />
		</QueryProvider>
	)
}
