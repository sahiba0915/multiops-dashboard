import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { store } from './features/store'
import { logout, selectAuthToken } from './features/auth/authSlice'
import { detectDeviceRegion } from './features/deviceLocale/deviceLocaleSlice'
import { reportApiError } from './features/globalApiError/globalApiErrorSlice'
import { setApiErrorHandler, setAuthTokenGetter } from './services/httpClient'

setAuthTokenGetter(() => selectAuthToken(store.getState()))

setApiErrorHandler(({ message, status, method, url }) => {
  if (status !== 401) {
    store.dispatch(reportApiError({ message, status, method, url }))
  }
  if (status === 401) {
    store.dispatch(logout())
    const path = window.location.pathname
    if (!path.startsWith('/login')) {
      window.location.assign('/login')
    }
  }
})

store.dispatch(detectDeviceRegion())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
