import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './provider/authProvider.jsx'

// createRoot create a root to display compo inside browser DOM
const root = createRoot(document.getElementById('root'));

root.render(
	<StrictMode>
		<AuthProvider>
			<App />
		</AuthProvider>
	</StrictMode>
)
