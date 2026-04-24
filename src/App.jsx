import { AppProvider } from './context/AppContext'
import { AppRouter } from './router/AppRouter'

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}

export default App
