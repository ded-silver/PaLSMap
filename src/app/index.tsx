import { ThemeProvider } from '@mui/material/styles'

import { QueryProvider } from './providers'
import { Router } from './router'
import '@/shared/styles/global.css'
import { appTheme } from '@/shared/styles/theme'

export const App = () => {
	return (
		<ThemeProvider theme={appTheme}>
			<QueryProvider>
				<Router />
			</QueryProvider>
		</ThemeProvider>
	)
}
