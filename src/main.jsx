import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { store } from './features/store'
import { selectAuthToken } from './features/auth/authSlice'
import { detectDeviceRegion } from './features/deviceLocale/deviceLocaleSlice'
import { setAuthTokenGetter } from './services/httpClient'

setAuthTokenGetter(() => selectAuthToken(store.getState()))
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
